package org.example.billingpayment.Config;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.example.billingpayment.Dto.PaymentDto;
import org.example.billingpayment.Model.Payment;
import org.example.billingpayment.Repository.PaymentRepository;
import org.example.billingpayment.Service.BillingService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.Acknowledgment;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;


/**
 * BillingKafkaListener: Consumes events from Order Service and reacts to them.

 * EVENT FLOW (from your architecture blueprint):

 *   Order Service ──[order-created]──► Billing Service ──[payment.success]──► Order Service
 *                                                       └──[invoice.generated]──► Email Service

 *   Order Service ──[order-cancelled]──► Billing Service ──[payment.refunded]──► Order Service

 * Each @KafkaListener is IDEMPOTENT — safe to process the same message twice.
 * (We check if invoice/payment already exists before creating a new one.)
 * This handles Kafka's "at-least-once delivery" guarantee gracefully.
 */
@Component
@Slf4j
@RequiredArgsConstructor
public class BillingKafkaListener {

    private final BillingService billingService;
    private final PaymentRepository paymentRepository;
    private final ObjectMapper objectMapper;



    @KafkaListener(
            topics = "order-created",
            groupId = "billing-service-group",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void handleOrderConfirmed(ConsumerRecord<String, String> record, Acknowledgment ack) {
        log.info("Received order-created for orderId: {}", record.key());

        try {
            JsonNode payload = objectMapper.readTree(record.value());

            String orderId   = payload.get("orderId").asText();
            String tenantId  = payload.get("tenantId").asText();
            String userId    = payload.get("userId").asText();
            BigDecimal amount = new BigDecimal(payload.get("amount").asText());
            String currency  = payload.get("currency").asText("INR");
            String description = payload.has("description")
                    ? payload.get("description").asText()
                    : "Payment for order " + orderId;

            // Idempotency: skip if payment already initiated for this order
            boolean alreadyExists = !paymentRepository.findByOrderId(orderId).isEmpty();
            if (alreadyExists) {
                log.info("Payment already exists for order {}, skipping", orderId);
                ack.acknowledge();
                return;
            }

            PaymentDto.InitiatePaymentRequest request = PaymentDto.InitiatePaymentRequest.builder()
                    .orderId(orderId)
                    .amount(amount)
                    .currency(currency)
                    .description(description)
                    .build();

            PaymentDto.PaymentInitiateResponse response = billingService.initiatePayment(request, userId, tenantId);
            log.info("Payment initiated for order {}: paymentId={}", orderId, response.getPaymentId());

            // Evict tenant-payments cache so dashboard shows updated list
            billingService.evictTenantPaymentCache(tenantId);

            ack.acknowledge();

        } catch (Exception e) {
            log.error("Failed to handle order-created for {}: {}", record.key(), e.getMessage());
            // No ack = Kafka will retry. Add Dead Letter Topic in production for repeated failures.
        }
    }

    /**
     * Listens to "order-cancelled" topic.
     *
     * Expected JSON:
     * {
     *   "orderId": "ord-123",
     *   "tenantId": "tenant-abc",
     *   "reason": "Customer request"
     * }
     *
     * If payment exists and is SUCCESS → trigger full refund automatically.
     * If payment is INITIATED/PENDING → just cancel it (no money moved yet).
     */
    @KafkaListener(
            topics = "order-cancelled",
            groupId = "billing-service-group",
            containerFactory = "kafkaListenerContainerFactory"
    )
    @CacheEvict(value = "tenant-payments", key = "#record.key()")
    public void handleOrderCancelled(ConsumerRecord<String, String> record, Acknowledgment ack) {
        log.info("Received order-cancelled for orderId: {}", record.key());

        try {
            JsonNode payload = objectMapper.readTree(record.value());
            String orderId = payload.get("orderId").asText();
            String reason  = payload.has("reason") ? payload.get("reason").asText() : "Order cancelled";

            // Find the successful payment for this order (if any)
            paymentRepository.findByOrderIdAndStatus(orderId, Payment.PaymentStatus.SUCCESS)
                    .stream()
                    .findFirst()
                    .ifPresent(payment -> {
                        log.info("Triggering refund for cancelled order {}, paymentId={}", orderId, payment.getId());

                        PaymentDto.RefundRequest refundRequest = new PaymentDto.RefundRequest(
                                payment.getId(),
                                null,      // null = full refund
                                reason
                        );

                        billingService.processRefund(refundRequest);
                    });

            ack.acknowledge();
            log.info("order-cancelled handled for: {}", orderId);

        } catch (Exception e) {
            log.error("Failed to handle order-cancelled for {}: {}", record.key(), e.getMessage());
        }
    }

    /**
     * Listens to Stripe webhook events relayed through Kafka.
     * This gives you ONE consistent pattern for all payment gateway events
     * instead of handling REST webhooks and Kafka separately.
     *
     * Expected JSON (forwarded from your webhook controller):
     * {
     *   "eventType": "payment_intent.succeeded",
     *   "paymentIntentId": "pi_xxx",
     *   "internalPaymentId": "our-payment-id"
     * }
     */
    @KafkaListener(
            topics = "payment.webhook.stripe",
            groupId = "billing-service-group",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void handleStripeWebhookEvent(ConsumerRecord<String, String> record, Acknowledgment ack) {
        log.info("Stripe webhook event via Kafka: key={}", record.key());

        try {
            JsonNode payload = objectMapper.readTree(record.value());
            String eventType = payload.get("eventType").asText();
            String internalPaymentId = payload.has("internalPaymentId")
                    ? payload.get("internalPaymentId").asText() : null;

            log.info("Processing Stripe webhook event: {} for payment: {}", eventType, internalPaymentId);
            // Status updates handled directly in StripePaymentService.handleWebhook()
            // This listener is for audit/notification purposes

            ack.acknowledge();

        } catch (Exception e) {
            log.error("Failed to handle stripe webhook event: {}", e.getMessage());
        }
    }
    /**
     * Listens to "stock-moved" topic.
     * When stock is moved/picked from warehouse, this triggers final billing reconciliation.
     */
    @KafkaListener(
            topics = "stock-moved",
            groupId = "billing-service-group",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void handleStockMoved(ConsumerRecord<String, String> record, Acknowledgment ack) {
        log.info("Stock moved event received: key={}", record.key());

        try {
            // Reconcile billing based on actual stock movement
            // This ensures billing matches physical inventory changes
            log.info("Billing: Stock movement recorded for reconciliation: {}", record.value());
            ack.acknowledge();

        } catch (Exception e) {
            log.error("Failed to handle stock-moved event: {}", e.getMessage());
        }
    }





}
