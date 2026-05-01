package org.example.controller;

import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;
import org.example.dto.OrderRequest;
import org.example.dto.OrderResponse;
import org.example.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody OrderRequest request,
            @RequestHeader("X-Tenant-Id") String tenantId
    ){
        OrderResponse response = orderService.createOrder(request, tenantId);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);

    }

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getAllOrders(@RequestHeader("X-Tenant-Id") String tenantId){
        return ResponseEntity.ok(orderService.getAllOrders(tenantId));
    }


    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-Id") String tenantId
    ){
        OrderResponse response = orderService.getOrderById(id, tenantId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<OrderResponse> getOrderByNumber(
            @PathVariable String orderNumber,
            @RequestHeader("X-Tenant-Id") String tenantId
    ){
        OrderResponse response = orderService.getOrderByNumber(orderNumber, tenantId);
        return  ResponseEntity.ok(response);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByCustomerId(
            @PathVariable Long customerId,
            @RequestHeader("X-Tenant-Id") String tenantId
    ){
      List<OrderResponse> responses = orderService.getOrdersByCustomerId(customerId, tenantId);
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestHeader("X-Tenant-Id") String tenantId
    ){
        OrderResponse response = orderService.updateOrderStatus(id, status, tenantId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelOrder(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-Id") String tenantId
    ) throws IllegalAccessException {
        orderService.cancelOrder(id, tenantId);
        return ResponseEntity.noContent().build();
    }



}
