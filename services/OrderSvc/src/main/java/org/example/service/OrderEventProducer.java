package org.example.service;

import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrderEventProducer {

    private static final String ORDER_CREATED_TOPIC = "order-created";
    private static final String ORDER_CANCELLED_TOPIC = "order-cancelled";

    private final KafkaTemplate<String, Object> kafkaTemplate;

    public void publishOrderCreatedEvent(Long orderId, String orderNumber,
                                         String tenantId, String userId, BigDecimal amount) {
        try {
            OrderEvent event = OrderEvent.builder()
                    .orderId(orderId)
                    .orderNumber(orderNumber)
                    .eventType("ORDER_CREATED")
                    .status("CONFIRMED")
                    .tenantId(tenantId)
                    .userId(userId)
                    .amount(amount)
                    .currency("INR")
                    .build();

            kafkaTemplate.send(ORDER_CREATED_TOPIC, orderNumber, event);
            log.info("Published ORDER_CREATED event for order: {}", orderNumber);
        } catch (Exception e) {
            log.error("Error publishing order created event", e);
        }
    }

    public void publishOrderCancelledEvent(Long orderId, String orderNumber,
                                           String tenantId, String reason) {
        try {
            OrderEvent event = OrderEvent.builder()
                    .orderId(orderId)
                    .orderNumber(orderNumber)
                    .eventType("ORDER_CANCELLED")
                    .status("CANCELLED")
                    .tenantId(tenantId)
                    .reason(reason)
                    .build();

            kafkaTemplate.send(ORDER_CANCELLED_TOPIC, orderNumber, event);
            log.info("Published ORDER_CANCELLED event for order: {}", orderNumber);
        } catch (Exception e) {
            log.error("Error publishing order cancelled event", e);
        }
    }

    public void publishOrderStatusChangedEvent(Long orderId, String orderNumber, String status) {
        try {
            OrderEvent event = OrderEvent.builder()
                    .orderId(orderId)
                    .orderNumber(orderNumber)
                    .eventType("ORDER_STATUS_CHANGED")
                    .status(status)
                    .build();

            kafkaTemplate.send(ORDER_CREATED_TOPIC, orderNumber, event);
            log.info("Published ORDER_STATUS_CHANGED event for order: {}", orderNumber);
        } catch (Exception e) {
            log.error("Error publishing order status changed event", e);
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderEvent {
        private Long orderId;
        private String orderNumber;
        private String eventType;
        private String status;
        private String tenantId;
        private String userId;
        private BigDecimal amount;
        private String currency;
        private String reason;
        private String description;
    }
}
