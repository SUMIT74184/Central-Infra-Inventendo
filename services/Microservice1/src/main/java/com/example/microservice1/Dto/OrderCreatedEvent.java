package com.example.microservice1.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OrderCreatedEvent {
    private Long orderId;
    private String orderNumber;
    private String eventType;
    private String status;
    private String tenantId;
    private String userId;
    private BigDecimal amount;
    private String currency;
}
