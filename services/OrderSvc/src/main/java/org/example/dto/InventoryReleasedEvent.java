package org.example.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InventoryReleasedEvent {
    private String tenantId;
    private Long orderId;
    private Long productId;
    private Integer quantity;
    private String warehouseCode;
    private Long warehouseId;
    private LocalDateTime releasedAt;
    private String performedBy;
}
