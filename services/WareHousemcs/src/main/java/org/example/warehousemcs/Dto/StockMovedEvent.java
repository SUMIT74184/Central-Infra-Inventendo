package org.example.warehousemcs.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockMovedEvent {
    private String orderId;
    private Long productId;
    private String sourceWarehouseCode;
    private String destinationWarehouseCode;
    private String tenantId;
    private Integer quantity;
    private String movementType;
}
