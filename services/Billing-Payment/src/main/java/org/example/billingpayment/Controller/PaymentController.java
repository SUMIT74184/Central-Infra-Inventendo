package org.example.billingpayment.Controller;


import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.billingpayment.Dto.PaymentDto;
import org.example.billingpayment.Model.Invoice;
import org.example.billingpayment.Model.Payment;
import org.example.billingpayment.Service.BillingService;
import org.example.billingpayment.Service.StripePaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


/**
 * PaymentController: REST API for all payment operations.

 * URL Structure:
 * /api/billing/payments/** → Payment operations
 * /api/billing/invoices/** → Invoice operations
 * /api/billing/webhooks/** → Webhook receivers from Stripe/Razorpay

 * Webhook endpoints MUST be public (no auth) because Stripe/Razorpay call them directly.
 * But they are secured by signature verification in the service layer.
 */

@RestController
@RequestMapping("/api/billing")
@Slf4j
@RequiredArgsConstructor
public class PaymentController {

    private final BillingService billingService;
    private final StripePaymentService stripePaymentService;

    @PostMapping("/payments/initiate")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PaymentDto.PaymentInitiateResponse> initiatePayment(
            @Valid @RequestBody PaymentDto.InitiatePaymentRequest request,
            @RequestHeader(value = "X-User-Id",defaultValue = "unknown") String userId,
            @RequestHeader(value = "X-Tenant-Id",defaultValue = "unknown") String tenantId

    ){
        log.info("Payment initiation for order: {} by user: {}",request.getOrderId(),userId);
        PaymentDto.PaymentInitiateResponse response = billingService.initiatePayment(request,userId,tenantId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);

    }
    /**
     * POST /api/billing/webhooks/stripe
     * Stripe calls this endpoint directly when payment status changes.

     * permitAll in SecurityConfig is needed for this endpoint.
     * The Stripe-Signature header is verified inside stripePaymentService.handleWebhook()

     * @RequestBody String payload: We need the RAW string, not a parsed object,
     * because Stripe's signature verification requires the exact raw bytes.
     */


    @PostMapping("/webhooks/stripe")
    public ResponseEntity<String> stripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String stripeSignature
    ){
        log.info("Stripe webhook received");
        stripePaymentService.handleWebhook(payload, stripeSignature);
        return ResponseEntity.ok("webhook processed");
    }


    @PostMapping("/payments/refund")
    @PreAuthorize("hasAnyRole('TENANT_ADMIN', 'MANAGER')")
    public ResponseEntity<PaymentDto.PaymentResponse>refundPayment(
            @Valid PaymentDto.RefundRequest request
    ){
        log.info("Refund request for payment: {}",request.getPaymentId());
        PaymentDto.PaymentResponse response = billingService.processRefund(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/payments")
    @PreAuthorize("hasAnyRole('TENANT_ADMIN', 'MANAGER')")
    public ResponseEntity<List<Payment>> getPayments(
            @RequestHeader(value = "X-Tenant-Id") String tenantId
    ){
        return ResponseEntity.ok(billingService.getPaymentsByTenant(tenantId));
    }

    public ResponseEntity<List<Invoice>> getInvoices(
           @RequestHeader(value = "X-Tenant-Id") String tenantId

    ){
        return ResponseEntity.ok(billingService.getInvoicesByTenant(tenantId));
    }




}
