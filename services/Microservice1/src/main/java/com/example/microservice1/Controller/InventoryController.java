package com.example.microservice1.Controller;


import com.example.microservice1.Dto.InventoryRequest;
import com.example.microservice1.Dto.InventoryResponse;
import com.example.microservice1.Service.InventoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
@ResponseStatus(HttpStatus.OK)
public class InventoryController {

    private final InventoryService inventoryService;

    @PostMapping
    public ResponseEntity<InventoryResponse> createInventory(
            @Valid @RequestBody InventoryRequest request,
            @RequestHeader("X-Tenant-Id") String tenantId
    ){
        InventoryResponse response = inventoryService.createInventory(request, tenantId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{sku}")
    public ResponseEntity<InventoryResponse> getInventoryBySku(
            @PathVariable String sku,
            @RequestHeader("X-Tenant-Id") String tenantId
    ){
        InventoryResponse response = inventoryService.getInventoryBySku(sku, tenantId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<org.springframework.data.domain.Page<InventoryResponse>> getAllInventory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestHeader("X-Tenant-Id") String tenantId
    ){
        org.springframework.data.domain.Page<InventoryResponse> response = inventoryService.getAllInventory(page, size, tenantId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/warehouse/{warehouseId}")
    public ResponseEntity<org.springframework.data.domain.Page<InventoryResponse>> getInventoryByWareHouse(
            @PathVariable String warehouseId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestHeader("X-Tenant-Id") String tenantId
    ){
        org.springframework.data.domain.Page<InventoryResponse> response = inventoryService.getInventoryByWarehouse(warehouseId, page, size, tenantId);
        return  ResponseEntity.ok(response);

    }
    @GetMapping("/low-stock")
    public ResponseEntity<List<InventoryResponse>> getLowStocksItems(
            @RequestHeader("X-Tenant-Id") String tenantId
    ){
        List<InventoryResponse>response = inventoryService.getLowStockItems(tenantId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{sku}/quantity")
    public ResponseEntity<InventoryResponse> updateQuantity(
            @PathVariable String sku,
            @RequestBody Map<String,Integer> request,
            @RequestHeader("X-Tenant-Id") String tenantId
    ){
        InventoryResponse response = inventoryService.updateQuantity(sku,request.get("quantity"), tenantId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{sku}/check")
    public ResponseEntity<Map<String,Boolean>> checkAvailability(
            @PathVariable String sku,
            @RequestParam Integer quantity,
            @RequestHeader("X-Tenant-Id") String tenantId
    ){
        boolean available = inventoryService.checkAvailability(sku,quantity, tenantId);
        return ResponseEntity.ok(Map.of("available",available));
    }

    @PostMapping("/{sku}/reserve")
    public ResponseEntity<Void> reserveStock(
            @PathVariable String sku,
            @RequestBody Map<String,Integer> request,
            @RequestHeader("X-Tenant-Id") String tenantId
    ){
        inventoryService.reserveStock(sku,request.get("quantity"), tenantId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{sku}/release")
    public ResponseEntity<Void> releaseStock(
            @PathVariable String sku,
            @RequestBody Map<String,Integer> request,
            @RequestHeader("X-Tenant-Id") String tenantId
    ){
        inventoryService.releaseReservedStock(sku,request.get("quantity"), tenantId);
        return ResponseEntity.ok().build();
    }
    @PostMapping("/{sku}/cancel-reservation")
    public ResponseEntity<Void>cancelReservation(
            @PathVariable String sku,
            @RequestParam Integer quantity,
            @RequestHeader("X-Tenant-Id") String tenantId
    ){
        inventoryService.cancelReservation(sku,quantity, tenantId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{sku}")
    public ResponseEntity<InventoryResponse> updateInventory(
            @PathVariable String sku,
            @RequestBody InventoryRequest request,
            @RequestHeader("X-Tenant-Id") String tenantId
    ) {
        InventoryResponse response = inventoryService.updateInventory(sku, request, tenantId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{sku}")
    public ResponseEntity<Void> deleteInventory(
            @PathVariable String sku,
            @RequestHeader("X-Tenant-Id") String tenantId
    ) {
        inventoryService.deleteInventory(sku, tenantId);
        return ResponseEntity.noContent().build();
    }


}
