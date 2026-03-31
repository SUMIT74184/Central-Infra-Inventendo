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
public class InventoryReservedEvent {

    private String orderId; // The ID of the order triggering the reservation
    private String productId; // Which product is being moved
    private String warehouseCode; // Crucial for your updateUtilization method
    private String tenantId; // Crucial for your multi-tenant lookups
    private Double quantity; // The amount to reserve/update utilization
    private LocalDateTime reservedAt;

}
