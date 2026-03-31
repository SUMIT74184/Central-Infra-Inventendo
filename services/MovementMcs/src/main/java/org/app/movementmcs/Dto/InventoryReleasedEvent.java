package org.app.movementmcs.Dto;

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
    private String orderId;
    private Long productId;
    private Long warehouseId;
    private Integer quantity;
    private String reason; // e.g., "ORDER_CANCELLED", "MANUAL_RELEASE"
    private LocalDateTime releasedAt;
}
