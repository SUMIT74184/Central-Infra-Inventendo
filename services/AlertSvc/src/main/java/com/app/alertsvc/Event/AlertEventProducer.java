package com.app.alertsvc.Event;
import com.app.alertsvc.dto.AlertDTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AlertEventProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Value("${kafka.topics.alert-notification}")
    private String alertNotificationTopic;

    public void sendNotification(AlertDTO alert) {
        try {
            log.info("Sending notification for alert ID: {} to tenant: {}", alert.getId(), alert.getTenantId());
            kafkaTemplate.send(alertNotificationTopic, alert.getTenantId(), alert);
            log.info("Notification sent successfully for alert ID: {}", alert.getId());
        } catch (Exception e) {
            log.error("Error sending notification for alert ID: {}", alert.getId(), e);
        }
    }
}

