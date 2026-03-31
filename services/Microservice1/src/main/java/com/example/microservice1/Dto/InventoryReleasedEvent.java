package com.example.microservice1.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InventoryReleasedEvent {
    private String tenantId;
    private String orderId;
    private Long productId;
    private String sku;
    private String warehouseId;
    private Integer quantity;
    private String reason;
    private LocalDateTime releasedAt;
    private String performedBy;
}
