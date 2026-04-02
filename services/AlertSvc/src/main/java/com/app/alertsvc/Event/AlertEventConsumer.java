package com.app.alertsvc.Event;

import com.app.alertsvc.entity.Alert;
import com.app.alertsvc.services.AlertService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * AlertEventConsumer: Listens to real Kafka topics published by other services
 * and converts incoming events into Alert entities.
 *
 * Each consumer is an ADAPTER — it takes the source service's native event format
 * and maps it into the Alert model that AlertSvc understands.
 *
 * Topics consumed:
 *   low-stock-alert    ← Inventory Service (when stock ≤ reorderLevel)
 *   order-cancelled    ← Order Service (when customer cancels)
 *   payment-failed     ← Billing Service (when payment fails)
 *   payment.refunded   ← Billing Service (when refund is processed)
 *   inventory-released ← Inventory Service (when reserved stock is released)
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AlertEventConsumer {

    private final AlertService alertService;

    /**
     * Low stock alert from Inventory Service.
     * Fires when available quantity drops below reorder level after a reservation.
     * Source: InventoryService.reserveStock() → "low-stock-alert"
     */
    @KafkaListener(topics = "${kafka.topics.low-stock-alert}", groupId = "alert-service-group")
    public void consumeLowStockAlert(Map<String, Object> event) {
        log.info("Alert: Received low-stock-alert event: {}", event);

        try {
            String sku = getStringValue(event, "sku");
            String warehouseId = getStringValue(event, "warehouseId");
            Object quantityObj = event.get("quantity");
            String quantity = quantityObj != null ? quantityObj.toString() : "unknown";

            Alert alert = Alert.builder()
                    .tenantId(getStringValue(event, "tenantId"))
                    .alertType(Alert.AlertType.LOW_STOCK)
                    .severity(Alert.Severity.HIGH)
                    .sourceService("INVENTORY")
                    .sourceId(sku)
                    .title("Low Stock Alert: " + sku)
                    .message("Stock for SKU '" + sku + "' in warehouse '" + warehouseId +
                            "' has dropped below reorder level. Only " + quantity + " units remaining.")
                    .metadata("{\"sku\":\"" + sku + "\",\"warehouseId\":\"" + warehouseId +
                            "\",\"quantity\":" + quantity + "}")
                    .status(Alert.AlertStatus.PENDING)
                    .notificationSent(false)
                    .build();

            alertService.createAlert(alert);
            log.info("Alert: Low stock alert created for SKU: {}", sku);
        } catch (Exception e) {
            log.error("Alert: Error processing low-stock-alert event", e);
        }
    }

    /**
     * Order cancelled alert from Order Service.
     * Fires when a customer or system cancels an order.
     * Source: OrderService.cancelOrder() → "order-cancelled"
     */
    @KafkaListener(topics = "${kafka.topics.order-cancelled}", groupId = "alert-service-group")
    public void consumeOrderCancelled(Map<String, Object> event) {
        log.info("Alert: Received order-cancelled event: {}", event);

        try {
            String orderId = getStringValue(event, "orderId");
            String orderNumber = getStringValue(event, "orderNumber");
            String reason = getStringValue(event, "reason");
            String tenantId = getStringValue(event, "tenantId");

            Alert alert = Alert.builder()
                    .tenantId(tenantId)
                    .alertType(Alert.AlertType.ORDER_FAILED)
                    .severity(Alert.Severity.MEDIUM)
                    .sourceService("ORDER")
                    .sourceId(orderNumber != null ? orderNumber : String.valueOf(orderId))
                    .title("Order Cancelled: " + (orderNumber != null ? orderNumber : orderId))
                    .message("Order " + (orderNumber != null ? orderNumber : orderId) +
                            " has been cancelled. Reason: " + (reason != null ? reason : "Not specified"))
                    .metadata("{\"orderId\":\"" + orderId + "\",\"orderNumber\":\"" + orderNumber +
                            "\",\"reason\":\"" + reason + "\"}")
                    .status(Alert.AlertStatus.PENDING)
                    .notificationSent(false)
                    .build();

            alertService.createAlert(alert);
            log.info("Alert: Order cancelled alert created for order: {}", orderNumber);
        } catch (Exception e) {
            log.error("Alert: Error processing order-cancelled event", e);
        }
    }

    /**
     * Payment failed alert from Billing Service.
     * Fires when a payment attempt fails.
     * Source: BillingService → "payment-failed" (not yet published, future-proofed)
     */
    @KafkaListener(topics = "${kafka.topics.payment-failed}", groupId = "alert-service-group")
    public void consumePaymentFailed(Map<String, Object> event) {
        log.info("Alert: Received payment-failed event: {}", event);

        try {
            String orderId = getStringValue(event, "orderId");
            String paymentId = getStringValue(event, "paymentId");
            String tenantId = getStringValue(event, "tenantId");

            Alert alert = Alert.builder()
                    .tenantId(tenantId)
                    .alertType(Alert.AlertType.PAYMENT_FAILED)
                    .severity(Alert.Severity.HIGH)
                    .sourceService("BILLING")
                    .sourceId(paymentId != null ? paymentId : orderId)
                    .title("Payment Failed for Order: " + orderId)
                    .message("Payment attempt failed for order '" + orderId +
                            "'. Payment ID: " + paymentId + ". Immediate attention required.")
                    .metadata("{\"orderId\":\"" + orderId + "\",\"paymentId\":\"" + paymentId + "\"}")
                    .status(Alert.AlertStatus.PENDING)
                    .notificationSent(false)
                    .build();

            alertService.createAlert(alert);
            log.info("Alert: Payment failed alert created for order: {}", orderId);
        } catch (Exception e) {
            log.error("Alert: Error processing payment-failed event", e);
        }
    }

    /**
     * Payment refunded alert from Billing Service.
     * Fires when a successful refund is processed.
     * Source: BillingService.processRefund() → "payment.refunded"
     */
    @KafkaListener(topics = "${kafka.topics.payment-refunded}", groupId = "alert-service-group")
    public void consumePaymentRefunded(Map<String, Object> event) {
        log.info("Alert: Received payment.refunded event: {}", event);

        try {
            String orderId = getStringValue(event, "orderId");
            String paymentId = getStringValue(event, "paymentId");
            String tenantId = getStringValue(event, "tenantId");
            String amount = getStringValue(event, "amount");

            Alert alert = Alert.builder()
                    .tenantId(tenantId)
                    .alertType(Alert.AlertType.BILLING_OVERDUE)
                    .severity(Alert.Severity.MEDIUM)
                    .sourceService("BILLING")
                    .sourceId(paymentId != null ? paymentId : orderId)
                    .title("Payment Refunded for Order: " + orderId)
                    .message("Refund of " + (amount != null ? amount : "unknown") +
                            " processed for order '" + orderId + "'. Payment ID: " + paymentId)
                    .metadata("{\"orderId\":\"" + orderId + "\",\"paymentId\":\"" + paymentId +
                            "\",\"amount\":\"" + amount + "\"}")
                    .status(Alert.AlertStatus.PENDING)
                    .notificationSent(false)
                    .build();

            alertService.createAlert(alert);
            log.info("Alert: Payment refunded alert created for order: {}", orderId);
        } catch (Exception e) {
            log.error("Alert: Error processing payment.refunded event", e);
        }
    }

    /**
     * Inventory released alert from Inventory Service.
     * Fires when reserved stock is released (e.g., order cancelled, payment failed).
     * Source: InventoryService.releaseReservedStock() → "inventory-released"
     */
    @KafkaListener(topics = "${kafka.topics.inventory-released}", groupId = "alert-service-group")
    public void consumeInventoryReleased(Map<String, Object> event) {
        log.info("Alert: Received inventory-released event: {}", event);

        try {
            String sku = getStringValue(event, "sku");
            String warehouseId = getStringValue(event, "warehouseId");
            String reason = getStringValue(event, "reason");
            Object quantityObj = event.get("quantity");
            String quantity = quantityObj != null ? quantityObj.toString() : "unknown";

            Alert alert = Alert.builder()
                    .tenantId(getStringValue(event, "tenantId"))
                    .alertType(Alert.AlertType.LOW_STOCK)
                    .severity(Alert.Severity.LOW)
                    .sourceService("INVENTORY")
                    .sourceId(sku)
                    .title("Inventory Released: " + sku)
                    .message("Released " + quantity + " units of SKU '" + sku +
                            "' from warehouse '" + warehouseId + "'. Reason: " +
                            (reason != null ? reason : "Not specified"))
                    .metadata("{\"sku\":\"" + sku + "\",\"warehouseId\":\"" + warehouseId +
                            "\",\"quantity\":" + quantity + ",\"reason\":\"" + reason + "\"}")
                    .status(Alert.AlertStatus.PENDING)
                    .notificationSent(false)
                    .build();

            alertService.createAlert(alert);
            log.info("Alert: Inventory released alert created for SKU: {}", sku);
        } catch (Exception e) {
            log.error("Alert: Error processing inventory-released event", e);
        }
    }

    /**
     * Safely extracts a String value from a Map, handling null and type mismatches.
     */
    private String getStringValue(Map<String, Object> event, String key) {
        Object value = event.get(key);
        return value != null ? value.toString() : null;
    }
}
