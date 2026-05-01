package com.example.microservice1.Service;

import com.example.microservice1.Dto.InventoryReleasedEvent;
import com.example.microservice1.Dto.InventoryRequest;
import com.example.microservice1.Dto.InventoryReservedEvent;
import com.example.microservice1.Dto.InventoryResponse;
import com.example.microservice1.Exception.InsufficientStockException;
import com.example.microservice1.Exception.InventoryNotFoundException;
import com.example.microservice1.Repository.InventoryRepository;
import com.example.microservice1.model.Inventory;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;


import java.util.List;
import java.util.stream.Collectors;


@Service
@Slf4j
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    private final KafkaTemplate<String,Object> kafkaTemplate;

    @Transactional
    @CacheEvict(value = "inventory", key = "#request.sku")
    public InventoryResponse createInventory(InventoryRequest request, String tenantId){
        Inventory inventory = new Inventory();
        inventory.setSku(request.getSku());
        inventory.setProductName(request.getProductName());
        inventory.setDescription(request.getDescription());
        inventory.setQuantity(request.getQuantity());
        inventory.setReorderLevel(request.getReorderLevel());
        inventory.setMaxStockLevel(request.getMaxStockLevel());
        inventory.setUnitPrice(request.getUnitPrice());
        inventory.setWarehouseId(request.getWarehouseId());
        inventory.setLocation(request.getLocation());
        inventory.setTenantId(tenantId);

        inventory.setReservedQuantity(0); 
        inventory.setInventoryStatus("ACTIVE");

        Inventory saved = inventoryRepository.save(inventory);
        log.info("Created inventory for SKU: {}",saved.getSku());

        //sending the data to the kafka
        kafkaTemplate.send("inventory-created",saved.getSku(),saved);
        return InventoryResponse.fromEntity(saved);

    }


    @Cacheable(value = "inventory", key = "#sku + '-' + #tenantId")
    public InventoryResponse getInventoryBySku(String sku, String tenantId){
        Inventory inventory = inventoryRepository.findBySkuAndTenantId(sku, tenantId)
                .orElseThrow(()-> new InventoryNotFoundException("Inventory is not found for SKU:" + sku + " for tenant: " + tenantId));
        return InventoryResponse.fromEntity(inventory);

    }
    public org.springframework.data.domain.Page<InventoryResponse> getAllInventory(int page, int size, String tenantId){
        return inventoryRepository.findByTenantId(tenantId, org.springframework.data.domain.PageRequest.of(page, size))
                .map(InventoryResponse::fromEntity);
    }

    //
    public org.springframework.data.domain.Page<InventoryResponse> getInventoryByWarehouse(String warehouseId, int page, int size, String tenantId){
        return inventoryRepository.findByWarehouseIdAndTenantId(warehouseId, tenantId, org.springframework.data.domain.PageRequest.of(page, size))
                .map(InventoryResponse::fromEntity);
    }

    public List<InventoryResponse> getLowStockItems(String tenantId){
        return inventoryRepository.findLowStocksItemsByTenantId(tenantId).stream()
                .map(InventoryResponse::fromEntity)
                .collect(Collectors.toList());
    }
    @Transactional
    @CacheEvict(value = "inventory", key = "#sku + '-' + #tenantId")
    public InventoryResponse updateQuantity(String sku, Integer quantity, String tenantId){
        Inventory inventory = inventoryRepository.findBySkuAndTenantId(sku, tenantId)
                .orElseThrow(()-> new InventoryNotFoundException("Inventory not found for sku "+sku + " and tenant " + tenantId));
        inventory.setQuantity(quantity);
        Inventory updated = inventoryRepository.save(inventory);
        log.info("Updated quantity for SKU: {} to {}",updated.getSku(),quantity);
        kafkaTemplate.send("inventory-updated",sku,updated);

        return InventoryResponse.fromEntity(updated);
    }
    @Transactional
    public boolean checkAvailability(String sku,Integer quantity, String tenantId){
        Inventory inventory = inventoryRepository.findBySkuAndTenantId(sku, tenantId)
                .orElseThrow(()-> new InventoryNotFoundException("Inventory not found for sku "+sku + " and tenant " + tenantId));
        return inventory.getAvailableQuantity()>=quantity;
    }

    @Transactional
    @CacheEvict(value = "inventory", key = "#sku + '-' + #tenantId")
    public void reserveStock(String sku, Integer quantity, String tenantId) {
        Inventory inventory = inventoryRepository.findBySkuWithLockAndTenantId(sku, tenantId)
                .orElseThrow(() -> new InventoryNotFoundException("Inventory not found for SKU: " + sku + " and tenant " + tenantId));

        if (inventory.getAvailableQuantity() < quantity) {
            throw new InsufficientStockException("Insufficient stock for sku" + sku);
        }

        inventory.setReservedQuantity(inventory.getReservedQuantity() + quantity);
        inventoryRepository.save(inventory);

        log.info("Reserved {} units for SKU: {}", quantity, sku);

        InventoryReservedEvent event = InventoryReservedEvent.builder()
                .productId(inventory.getId())
                .sku(sku)
                .tenantId(tenantId)
                .warehouseId(inventory.getWarehouseId())
                .quantity(quantity)
                .reservedAt(LocalDateTime.now())
                .performedBy("SYSTEM")
                .build();
        kafkaTemplate.send("inventory-reserved", sku, event);

        // Check low stock and publish alert
        if (inventory.getAvailableQuantity() <= inventory.getReorderLevel()) {
            log.warn("Low stock alert for SKU: {} — available: {}, reorder level: {}",
                    sku, inventory.getAvailableQuantity(), inventory.getReorderLevel());
            kafkaTemplate.send("low-stock-alert", sku, event);
        }
    }

    @Transactional
    @CacheEvict(value = "inventory", key = "#sku + '-' + #tenantId")
    public void releaseReservedStock(String sku, Integer quantity, String tenantId) {
        Inventory inventory = inventoryRepository.findBySkuWithLockAndTenantId(sku, tenantId)
                .orElseThrow(() -> new InventoryNotFoundException("Inventory not found sku : " + sku + " and tenant " + tenantId));

        inventory.setReservedQuantity(Math.max(0, inventory.getReservedQuantity() - quantity));
        inventory.setQuantity(Math.max(0, inventory.getQuantity() - quantity));

        inventoryRepository.save(inventory);
        log.info("Released {} units for SKU: {}", quantity, sku);

        InventoryReleasedEvent event = InventoryReleasedEvent.builder()
                .productId(inventory.getId())
                .sku(sku)
                .warehouseId(inventory.getWarehouseId())
                .quantity(quantity)
                .reason("MANUAL_RELEASE")
                .releasedAt(LocalDateTime.now())
                .performedBy("SYSTEM")
                .build();
        kafkaTemplate.send("inventory-released", sku, event)
                .whenComplete((result, ex) -> {
                    if (ex != null) log.error("Failed to send Kafka message", ex);
                });
    }
    @Transactional
    @CacheEvict(value = "inventory", key = "#sku + '-' + #tenantId")
    public void cancelReservation(String sku, Integer quantity, String tenantId) {
        Inventory inventory = inventoryRepository.findBySkuWithLockAndTenantId(sku, tenantId)
                .orElseThrow(() -> new InventoryNotFoundException("SKU not found: " + sku + " and tenant " + tenantId));

        inventory.setReservedQuantity(inventory.getReservedQuantity() - quantity);

        inventoryRepository.save(inventory);

        log.info("Payment Failed: Cancelled reservation of {} units for SKU: {}", quantity, sku);
        kafkaTemplate.send("inventory-cancelled", sku, quantity);
    }


}
