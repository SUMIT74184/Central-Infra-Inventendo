package org.example.billingpayment.Service;


import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.billingpayment.Dto.PaymentDto;
import org.example.billingpayment.Model.Invoice;
import org.example.billingpayment.Model.Payment;
import org.example.billingpayment.Repository.InvoiceRepository;
import org.example.billingpayment.Repository.PaymentRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.atomic.AtomicLong;

/**
 * BillingService: The orchestrator that ties together Invoice and Payment logic.

 * It decides:
 * - Which payment gateway to use (RAZORPAY for INR, STRIPE for others)
 * - When to generate invoices
 * - When to notify other services via Kafka
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class BillingService {

    private final RazorpayPaymentService razorpayPaymentService;
    private final StripePaymentService stripePaymentService;
    private InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final KafkaTemplate<String,String>kafkaTemplate;


    private final AtomicLong invoiceCounter = new AtomicLong(1);


    public PaymentDto.PaymentInitiateResponse initiatePayment(
            PaymentDto.InitiatePaymentRequest request, String userId, String tenantId){


        Payment.PaymentGateway gateway = request.getGateway() != null
                ? request.getGateway()
                : inferGateway(request.getCurrency());

        request = PaymentDto.InitiatePaymentRequest.builder()
                .orderId(request.getOrderId())
                .amount(request.getAmount())
                .currency(request.getCurrency())
                .gateway(gateway)
                .description(request.getDescription())
                .description(request.getDescription())
                .build();

        return switch(gateway){
            case  RAZORPAY -> razorpayPaymentService.initiateResponse(request,userId,tenantId);
            case STRIPE -> stripePaymentService.initiateResponse(request,userId,tenantId);
            default -> throw new IllegalArgumentException("Unsupported gateway" + gateway);
        };
    }

    /**
     * After Razorpay verification succeeds → update payment status → evict stale cache
     * → generate invoice → publish Kafka event so Order Service can ship the goods.
     */

    @Transactional
    @CacheEvict(value = "payments", key = "#request.internalPaymentId")
    public PaymentDto.PaymentResponse verifyRazorPayPayment(PaymentDto.RazorpayVerificationRequest request){
        PaymentDto.PaymentResponse paymentResponse = razorpayPaymentService.verifyAndCapturePayment(request);

        if(paymentResponse.getStatus() == Payment.PaymentStatus.SUCCESS){
            generateInvoiceForPayment(paymentResponse);

            //publish to kafka: Order Service listens to "Payment.SUCCESS" to trigger warehouse picking and shipping
            publishPaymentEvent("payment.success",paymentResponse);

        }
        return paymentResponse;

    }

    /**
     * @Cacheable("payments"): Cache payment lookup by ID.

     * Why: Dashboard calls getPaymentById for every row in the payments table.
     * 100 payments on screen = 100 DB calls without cache, 1 DB call with cache
     * (only first load hits DB; subsequent hits served from Redis in <1ms).

     * key="#paymentId": Each payment cached with its own key.
     * Cache entry lives 10 min (set in RedisConfig for "payments" cache).
     */
    @Cacheable(value = "payments",key = "#paymentId")
    public Payment getPaymentById(String paymentId){
    log.debug("Cache miss - loading from payment from DB: {}",paymentId);
    return paymentRepository.findById(paymentId)
            .orElseThrow(()-> new RuntimeException("payment not found " + paymentId));

    }
    /**
     * @Cacheable("tenant-payments"): Cache the full list of payments per tenant.
     *
     * Why: The billing dashboard loads this list on every page open.
     * TTL is short (5 min) because new payments come in frequently.
     * When a new payment is created, @CacheEvict below clears this list.
     */

    public List<Payment> getPaymentsByTenant(String tenantId){
        log.debug("Cache miss - laoding payments for tenant: {}",tenantId);
        return paymentRepository.findByTenantIdOrderByCreatedAtDesc(tenantId);
    }
    /**
     * @Cacheable("invoices"): Cache invoice by ID.
     * Invoices almost never change after creation (only status can change).
     * TTL = 30 min (longest, set in RedisConfig).
     */
    @Cacheable(value = "invoices", key = "#invoiceId")
    public Invoice getInvoiceById(String invoiceId){
        log.debug("Cache miss - loading invoice from DB : {}",invoiceId);
        return invoiceRepository.findById(invoiceId)
                .orElseThrow(()-> new RuntimeException("Invoice not found:" + invoiceId));
    }

    @Cacheable(value = "invoices", key = "'tenant-' + #tenantId")
    public List<Invoice> getInvoicesByTenant(String tenantId){
        return invoiceRepository.findByTenantIdOrderByCreatedAtDesc(tenantId);
    }


    /**
     * Refund: update payment in DB → evict its cache → evict tenant list cache
     * → publish Kafka event so Order Service marks order as refunded.
     *
     * @CacheEvict with multiple caches: Both "payments" (this specific payment)
     * and "tenant-payments" (the list for this tenant) must be cleared
     * because both contain stale data after the status changes to REFUNDED.
     */
    @Transactional
    @CacheEvict(value = {"payments", "tenant-payments"}, allEntries = false, key = "#request.paymentId")
    public PaymentDto.PaymentResponse processRefund(PaymentDto.RefundRequest request){
        Payment payment = paymentRepository.findById(request.getPaymentId())
                    .orElseThrow(()-> new RuntimeException("payment not found: " + request.getPaymentId()));

        PaymentDto.PaymentResponse response = switch (payment.getGateway()){
            case RAZORPAY -> razorpayPaymentService.processRefund(payment.getId(),request.getRefundAmount());
            case STRIPE -> stripePaymentService.processRefund(payment.getId(),request.getRefundAmount());
            default -> throw new IllegalArgumentException("Unknown gateway: " + payment.getGateway());
        };

        invoiceRepository.findByPaymentId(payment.getId())
                .ifPresent(invoice -> {
                    invoice.setStatus(Invoice.InvoiceStatus.CANCELLED);
                    invoiceRepository.save(invoice);
                    evictInvoiceCache(invoice.getId());
                });

        publishPaymentEvent("payment.refunded",response);
        return response;
    }

    @Transactional
    public Invoice generateInvoiceForPayment(PaymentDto.PaymentResponse paymentResponse){
        String year = String.valueOf(LocalDate.now().getYear());
        String invoiceNumber = "INV-" + year + "-" + String.format("%06d",invoiceCounter.getAndIncrement());

        Invoice invoice =Invoice.builder()
                .invoiceNumber(invoiceNumber)
                .orderId(paymentResponse.getOrderId())
                .tenantId(paymentResponse.getTenantId())
                .customerId(paymentResponse.getTenantId())
                .subtotal(paymentResponse.getAmount())
                .taxAmount(BigDecimal.ZERO)
                .discountAmount(BigDecimal.ZERO)
                .totalAmount(paymentResponse.getAmount())
                .currency(paymentResponse.getCurrency())
                .status(Invoice.InvoiceStatus.PAID)
                .dueDate(LocalDateTime.now())
                .paymentId(paymentResponse.getId())
                .build();

        Invoice saved = new  Invoice();


        return saved;

    }

    @CacheEvict(value = "invoices", key = "#invoiceId")
    public void evictInvoiceCache(String invoiceId){
        log.debug("Evicting invoice cache for:{}",invoiceId);
    }


    @CacheEvict(value = "tenant-payments",key = "#tenantId")
    public void evictTenantPaymentCache(String tenantId){
        log.debug("Evicting tenant-payments cache for: {}",tenantId);
    }


    private Payment.PaymentGateway inferGateway(String currency){
        return "INR".equalsIgnoreCase(currency) ? Payment.PaymentGateway.RAZORPAY : Payment.PaymentGateway.STRIPE;
    }


    /**
     * Publishes a structured Kafka message for payment events.

     * Key = orderId: ensures all events for the same order go to the SAME Kafka partition.
     * Kafka guarantees ordering WITHIN a partition, so Order Service will always receive
     * payment.initiated before payment.success for the same order. No race conditions.

     * Topics consumed by:
     *   "payment.success"  → Order Service (trigger shipping), Inventory Service (deduct stock)
     *   "payment.failed"   → Order Service (notify customer, release reserved stock)
     *   "payment.refunded" → Order Service (mark as refunded), Notification Service
     */

    private void publishPaymentEvent(String topic, PaymentDto.PaymentResponse payment){
        try{
            String payload = String.format(
                    "{\"eventType\":\"%s\",\"paymentId\":\"%s\",\"orderId\":\"%s\"," +
                            "\"tenantId\":\"%s\",\"status\":\"%s\",\"amount\":%s,\"currency\":\"%s\"}",
                            topic,
                    payment.getId(),
                    payment.getOrderId(),
                    payment.getTenantId(),
                    payment.getStatus(),
                    payment.getAmount(),
                    payment.getCurrency()
            );
            kafkaTemplate.send(topic,payment.getOrderId(),payload);
            log.info("Published {} event for order: {}",topic,payment.getOrderId());

        } catch (Exception e) {
            log.warn("Failed to publish Kafka event to {}:{}",topic,e.getMessage());
        }
    }


    private void publishInvoiceEvent(String topic, Invoice invoice){
        try{
            String payload = String.format(
                    "{\"eventType\":\"%s\",\"invoiceId\":\"%s\",\"invoiceNumber\":\"%s\"," +
                            "\"orderId\":\"%s\",\"tenantId\":\"%s\",\"totalAmount\":%s}",
                    topic,
                    invoice.getId(),
                    invoice.getInvoiceNumber(),
                    invoice.getOrderId(),
                    invoice.getTenantId(),
                    invoice.getTotalAmount()
                    );

            kafkaTemplate.send(topic,invoice.getOrderId(),payload);
            log.info("published {} event for invoice: {}",topic,invoice.getInvoiceNumber());

        } catch (Exception e) {
            log.warn("Failed to publish Kafka event to {}:{}",topic,e.getMessage());
        }
    }






}
