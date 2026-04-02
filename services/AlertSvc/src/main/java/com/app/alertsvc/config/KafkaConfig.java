package com.app.alertsvc.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {

    @Value("${kafka.topics.low-stock-alert}")
    private String lowStockAlert;

    @Value("${kafka.topics.order-cancelled}")
    private String orderCancelled;

    @Value("${kafka.topics.payment-failed}")
    private String paymentFailed;

    @Value("${kafka.topics.payment-refunded}")
    private String paymentRefunded;

    @Value("${kafka.topics.inventory-released}")
    private String inventoryReleased;

    @Value("${kafka.topics.alert-notification}")
    private String alertNotification;

    @Bean
    public NewTopic lowStockAlertTopic() {
        return TopicBuilder.name(lowStockAlert)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic orderCancelledTopic() {
        return TopicBuilder.name(orderCancelled)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic paymentFailedTopic() {
        return TopicBuilder.name(paymentFailed)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic paymentRefundedTopic() {
        return TopicBuilder.name(paymentRefunded)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic inventoryReleasedTopic() {
        return TopicBuilder.name(inventoryReleased)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic alertNotificationTopic() {
        return TopicBuilder.name(alertNotification)
                .partitions(3)
                .replicas(1)
                .build();
    }
}
