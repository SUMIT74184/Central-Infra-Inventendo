package org.example.warehousemcs.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderCancelledEvent {
    private Long orderId;
    private String orderNumber;
    private String eventType;
    private String status;
    private String tenantId;
    private String reason;
}
