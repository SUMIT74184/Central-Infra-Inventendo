package org.example.warehousemcs.Event;

import org.example.warehousemcs.Dto.InventoryReservedEvent;
import org.example.warehousemcs.Dto.WarehouseDTO;
import org.example.warehousemcs.service.WarehouseServiceImpl;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class WarehouseConsumer {

    private final WarehouseServiceImpl warehouseServiceImpl;

    /**
     * When a new order is created, find an available warehouse and assign it.
     */
    @KafkaListener(topics = "order-created", groupId = "warehouse-order-created-group")
    public void handleOrderCreated(Map<String, Object> event) {
        String orderNumber = (String) event.get("orderNumber");
        String tenantId = (String) event.get("tenantId");
        log.info("Warehouse: Received order-created for order: {}, tenant: {}", orderNumber, tenantId);

        try {
            List<WarehouseDTO> available = warehouseServiceImpl.getAvailableWarehouses(tenantId);
            if (!available.isEmpty()) {
                WarehouseDTO assigned = available.get(0);
                warehouseServiceImpl.publishWarehouseAssignment(orderNumber, assigned);
                log.info("Warehouse: Assigned warehouse {} to order {}",
                        assigned.getWarehouseCode(), orderNumber);
            } else {
                log.warn("Warehouse: No available warehouses for tenant {} — order {} pending",
                        tenantId, orderNumber);
            }
        } catch (Exception e) {
            log.error("Warehouse: Failed to assign warehouse for order: {}", orderNumber, e);
        }
    }

    /**
     * When inventory is reserved, update the warehouse utilization.
     */
    @KafkaListener(topics = "inventory-reserved", groupId = "warehouse-inventory-reserved-group")
    public void handleInventoryReserved(InventoryReservedEvent event) {
        log.info("Warehouse: Received inventory-reserved for order: {}, warehouse: {}",
                event.getOrderId(), event.getWarehouseCode());

        try {
            if (event.getWarehouseCode() != null && event.getTenantId() != null) {
                warehouseServiceImpl.updateUtilization(
                        event.getWarehouseCode(),
                        event.getTenantId(),
                        event.getQuantity());
                log.info("Warehouse: Updated utilization for warehouse: {}", event.getWarehouseCode());
            }
        } catch (Exception e) {
            log.error("Warehouse: Failed to update utilization: {}", e.getMessage());
        }
    }
}

