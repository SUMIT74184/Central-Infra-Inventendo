package org.example.warehousemcs.Dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WarehouseAssignedEvent {
    private Long tenantId;
    private String orderId;
    private Long productId;
    private Long warehouseId;
    private String warehouseCode;
    private LocalDateTime assignedAt;

}
