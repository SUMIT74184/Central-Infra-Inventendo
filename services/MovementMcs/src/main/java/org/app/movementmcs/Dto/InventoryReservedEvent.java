package org.app.movementmcs.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class InventoryReservedEvent {

    private String tenantId;
    private String orderId;
    private Long productId;

    private String warehouseCode;
    private Long warehouseId;

    private Integer quantity;
    private String idempotencyKey;
    private LocalDateTime reservedAt;
    private String performedBy;

}
