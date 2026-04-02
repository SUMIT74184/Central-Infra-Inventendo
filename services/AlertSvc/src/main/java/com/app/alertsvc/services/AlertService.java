package com.app.alertsvc.services;

import com.app.alertsvc.Event.AlertEventProducer;
import com.app.alertsvc.dto.AlertDTO;
import com.app.alertsvc.entity.Alert;
import com.app.alertsvc.repositories.AlertRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AlertService {

    private final AlertRepository alertRepository;
    private final AlertEventProducer alertEventProducer;
    private final RedisTemplate<String,Object>redisTemplate;

    private static final String ALERT_CACHE_PREFIX = "alert:";
    private static final String TENANT_ALERT_COUNT_PREFIX = "tenant:alert:count";



    @Transactional
    public AlertDTO createAlert(Alert alert) {
        log.info("Creating alert for tenant: {} with type: {}", alert.getTenantId(), alert.getAlertType());

        Alert savedAlert = alertRepository.save(alert);

        AlertDTO alertDTO = convertToDTO(savedAlert);

        cacheAlert(alertDTO);
        incrementTenantAlertCount(alert.getTenantId());

        if (shouldSendNotification(savedAlert)) {
            alertEventProducer.sendNotification(alertDTO);
            savedAlert.setNotificationSent(true);
            alertRepository.save(savedAlert);
        }

        log.info("Alert created successfully with ID: {}", savedAlert.getId());
        return alertDTO;
    }


    public AlertDTO getAlertById(Long id,String tenantId){
        String cacheKey = ALERT_CACHE_PREFIX + id;
        AlertDTO cachedAlert = (AlertDTO) redisTemplate.opsForValue().get(cacheKey);

        if(cachedAlert != null && cachedAlert.getTenantId().equals(tenantId)){
            return cachedAlert;
        }
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found"));

        if (!alert.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Unauthorized access to alert");
        }

        AlertDTO alertDTO = convertToDTO(alert);
        cacheAlert(alertDTO);

        return alertDTO;


    }

    public List<AlertDTO> getAlertsByTenant(String tenantId){
        return alertRepository.findByTenantIdOrderByCreatedAtDesc(tenantId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AlertDTO> getAlertsByStatus(String tenantId, Alert.AlertStatus status){
        return alertRepository.findByTenantIdAndStatusOrderByCreatedAtDesc(tenantId,status)

                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AlertDTO> getCriticalAlerts(String tenantId) {
        return alertRepository.findCriticalPendingAlerts(tenantId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AlertDTO> getRecentAlerts(String tenantId, int hours) {
        LocalDateTime since = LocalDateTime.now().minusHours(hours);
        return alertRepository.findRecentAlerts(tenantId, since)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public AlertDTO acknowledgeAlert(Long id, String tenantId, String acknowledgedBy) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found"));

        if (!alert.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Unauthorized access to alert");
        }

        alert.setStatus(Alert.AlertStatus.ACKNOWLEDGED);
        alert.setAcknowledgedBy(acknowledgedBy);
        alert.setAcknowledgedAt(LocalDateTime.now());

        Alert savedAlert = alertRepository.save(alert);
        AlertDTO alertDTO = convertToDTO(savedAlert);
        cacheAlert(alertDTO);

        log.info("Alert {} acknowledged by {}", id, acknowledgedBy);
        return alertDTO;
    }


    @Transactional
    public AlertDTO resolveAlert(Long id, String tenantId, String resolvedBy) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found"));

        if (!alert.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Unauthorized access to alert");
        }

        alert.setStatus(Alert.AlertStatus.RESOLVED);
        alert.setResolvedBy(resolvedBy);
        alert.setResolvedAt(LocalDateTime.now());

        Alert savedAlert = alertRepository.save(alert);
        AlertDTO alertDTO = convertToDTO(savedAlert);
        cacheAlert(alertDTO);

        log.info("Alert {} resolved by {}", id, resolvedBy);
        return alertDTO;
    }


    public Long getPendingAlertCount(String tenantId) {
        String cacheKey = TENANT_ALERT_COUNT_PREFIX + tenantId;
        Object count = redisTemplate.opsForValue().get(cacheKey);

        if (count != null) {
            return ((Number) count).longValue();
        }

        Long dbCount = alertRepository.countPendingAlerts(tenantId);
        redisTemplate.opsForValue().set(cacheKey, dbCount, 5, TimeUnit.MINUTES);
        return dbCount;
    }

    private boolean shouldSendNotification(Alert alert) {
        return alert.getSeverity() == Alert.Severity.HIGH || alert.getSeverity() == Alert.Severity.CRITICAL;
    }

    private void cacheAlert(AlertDTO alert) {
        String cacheKey = ALERT_CACHE_PREFIX + alert.getId();
        redisTemplate.opsForValue().set(cacheKey, alert, 10, TimeUnit.MINUTES);
    }


    private void incrementTenantAlertCount(String tenantId) {
        String cacheKey = TENANT_ALERT_COUNT_PREFIX + tenantId;
        redisTemplate.opsForValue().increment(cacheKey);
    }

    private AlertDTO convertToDTO(Alert alert) {
        return AlertDTO.builder()
                .id(alert.getId())
                .tenantId(alert.getTenantId())
                .alertType(alert.getAlertType())
                .severity(alert.getSeverity())
                .sourceService(alert.getSourceService())
                .sourceId(alert.getSourceId())
                .title(alert.getTitle())
                .message(alert.getMessage())
                .metadata(alert.getMetadata())
                .status(alert.getStatus())
                .notificationSent(alert.getNotificationSent())
                .acknowledgedBy(alert.getAcknowledgedBy())
                .acknowledgedAt(alert.getAcknowledgedAt())
                .resolvedBy(alert.getResolvedBy())
                .resolvedAt(alert.getResolvedAt())
                .createdAt(alert.getCreatedAt())
                .updatedAt(alert.getUpdatedAt())
                .build();
    }

}
