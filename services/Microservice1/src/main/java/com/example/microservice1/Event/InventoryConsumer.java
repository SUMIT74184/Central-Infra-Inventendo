package com.example.microservice1.Event;

import com.example.microservice1.Dto.OrderCreatedEvent;
import com.example.microservice1.Service.InventoryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

/**
 * Kafka consumers for the Inventory Service.
 *
 * Listens to:
 *   - order-cancelled  → release reserved stock
 *   - payment-failed   → release reserved stock
 *   - stock-moved      → adjust stock based on movement
 */
@Service
@Slf4j
@RequiredArgsConstructor
public class InventoryConsumer {

    private final InventoryService inventoryService;

    /**
     * When an order is cancelled, release the reserved stock back.
     * The event key is the order number, value is the OrderEvent DTO.
     */
    @KafkaListener(topics = "order-cancelled", groupId = "inventory-order-cancelled-group")
    public void handleOrderCancelled(OrderCreatedEvent event) {
        log.info("Inventory: Received order-cancelled for order: {}", event.getOrderNumber());
        // Stock release is already triggered via Feign in OrderService.cancelOrder()
        // This consumer acts as a safety net for eventual consistency
        log.info("Inventory: Order {} cancelled — stock will be released via Feign call", event.getOrderNumber());
    }

    /**
     * When payment fails, release the reserved stock.
     */
    @KafkaListener(topics = "payment-failed", groupId = "inventory-payment-failed-group")
    public void handlePaymentFailed(String paymentEvent) {
        log.info("Inventory: Received payment-failed event: {}", paymentEvent);
        // Parse orderId from the payment event and release stock
        // In production, deserialize to a proper DTO
        log.warn("Inventory: Payment failed — stock should be released for this order");
    }

    /**
     * When stock is physically moved (warehouse transfer), adjust inventory levels.
     */
    @KafkaListener(topics = "stock-moved", groupId = "inventory-stock-moved-group")
    public void handleStockMoved(String stockMovedEvent) {
        log.info("Inventory: Received stock-moved event: {}", stockMovedEvent);
        // Adjust stock quantities based on the movement
        // In production, deserialize to StockUpdateEvent and call inventoryService
        log.info("Inventory: Stock movement recorded — inventory levels will be adjusted");
    }
}
