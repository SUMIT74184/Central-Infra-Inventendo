package org.app.movementmcs.Event;

import java.time.LocalDateTime;
import java.util.Map;

import org.app.movementmcs.Dto.InventoryReleasedEvent;
import org.app.movementmcs.Dto.InventoryReservedEvent;
import org.app.movementmcs.Entity.StockMovement;
import org.app.movementmcs.Repository.StockMovementRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class MovementConsumer {

    private final StockMovementRepository movementRepository;

    @KafkaListener(topics = "inventory-reserved", groupId = "movement-reserve-group")
    public void handleInventoryReserved(InventoryReservedEvent event) {
        log.info("Processing movement for order: {}", event.getOrderId());

        StockMovement movement = StockMovement.builder()
                .tenantId(event.getTenantId())
                .productId(event.getProductId())
                .warehouseId(event.getWarehouseId())
                .movementType(StockMovement.MovementType.RESERVED)
                .quantity(event.getQuantity())
                .referenceNumber(event.getOrderId())
                .performedBy(event.getPerformedBy() != null ? event.getPerformedBy() : "SYSTEM")
                .idempotencyKey("RES-" + event.getOrderId() + "-" + event.getProductId())
                .status(StockMovement.MovementStatus.COMPLETED)
                .createdAt(LocalDateTime.now())
                .build();

        movementRepository.save(movement);
    }

    @KafkaListener(topics = "inventory-released", groupId = "movement-release-group")
    public void handleInventoryReleased(InventoryReleasedEvent event) {
        log.info("Processing movement for order: {}", event.getOrderId());

        StockMovement movement = StockMovement.builder()
                .tenantId(event.getTenantId())
                .productId(event.getProductId())
                .warehouseId(event.getWarehouseId())
                .movementType(StockMovement.MovementType.IN) // 'IN' because stock is returning
                .quantity(event.getQuantity())
                .referenceNumber(event.getOrderId())
                .reason(event.getReason())
                .idempotencyKey("REL-" + event.getOrderId())
                .status(StockMovement.MovementStatus.COMPLETED)
                .createdAt(LocalDateTime.now())
                .build();

        movementRepository.save(movement);
    }

    /**
     * When a warehouse is assigned to an order, log the movement for audit trail.
     */
    @KafkaListener(topics = "warehouse-assigned", groupId = "movement-warehouse-assigned-group")
    public void handleWarehouseAssigned(Map<String, Object> event) {
        String orderId = (String) event.get("orderId");
        String warehouseCode = (String) event.get("warehouseCode");
        log.info("Movement: Warehouse {} assigned to order: {}", warehouseCode, orderId);

        try {
            StockMovement movement = StockMovement.builder()
                    .productId(0L) // Will be set when actual pick happens
                    .warehouseId(event.get("warehouseId") != null
                            ? ((Number) event.get("warehouseId")).longValue() : 0L)
                    .movementType(StockMovement.MovementType.OUT)
                    .quantity(0) // Will be set during actual pick
                    .referenceNumber(orderId)
                    .performedBy("SYSTEM")
                    .idempotencyKey("WH-ASSIGN-" + orderId)
                    .status(StockMovement.MovementStatus.PENDING)
                    .createdAt(LocalDateTime.now())
                    .build();

            movementRepository.save(movement);
            log.info("Movement: Warehouse assignment recorded for order: {}", orderId);
        } catch (Exception e) {
            log.error("Movement: Failed to record warehouse assignment for order: {}", orderId, e);
        }
    }
}
