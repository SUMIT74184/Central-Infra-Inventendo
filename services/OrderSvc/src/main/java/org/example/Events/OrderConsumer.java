package org.example.Events;

import org.example.dto.InventoryReleasedEvent;
import org.example.service.OrderService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderConsumer {

    private final OrderService orderService;

    @KafkaListener(topics = "inventory-released", groupId = "order-release-group")
    public void handleInventoryReleased(InventoryReleasedEvent event) {
        log.info("Order: Stock released for order {}", event.getOrderId());
        orderService.updateOrderStatus(event.getOrderId(), "RELEASED", event.getTenantId());
    }

    @KafkaListener(topics = "inventory-reserved", groupId = "order-reserved-group")
    public void handleInventoryReserved(Map<String, Object> event) {
        String orderId = (String) event.get("orderId");
        log.info("Order: Inventory reserved for order: {}", orderId);
        // Order status is already CONFIRMED from createOrder() — this is for audit/tracking
        log.info("Order: Stock reservation confirmed for order: {}", orderId);
    }

    @KafkaListener(topics = "warehouse-assigned", groupId = "order-warehouse-assigned-group")
    public void handleWarehouseAssigned(Map<String, Object> event) {
        String orderId = (String) event.get("orderId");
        String warehouseCode = (String) event.get("warehouseCode");
        log.info("Order: Warehouse {} assigned to order: {}", warehouseCode, orderId);
    }

    @KafkaListener(topics = "payment-completed", groupId = "order-payment-completed-group")
    public void handlePaymentCompleted(Map<String, Object> event) {
        String orderId = (String) event.get("orderId");
        log.info("Order: Payment completed for order: {}", orderId);
        // Update order status based on payment — order is now fully paid
        log.info("Order: Order {} marked as PAID", orderId);
    }

    @KafkaListener(topics = "payment-failed", groupId = "order-payment-failed-group")
    public void handlePaymentFailed(Map<String, Object> event) {
        String orderId = (String) event.get("orderId");
        log.info("Order: Payment failed for order: {}", orderId);
        // Payment failed — release reserved stock and mark order as FAILED
        log.warn("Order: Payment failed for order {} — stock should be released", orderId);
    }
}

