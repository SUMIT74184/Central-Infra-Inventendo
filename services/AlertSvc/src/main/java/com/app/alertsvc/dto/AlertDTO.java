package com.app.alertsvc.dto;

import com.app.alertsvc.entity.Alert;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertDTO {
    private Long id;
    private String tenantId;
    private Alert.AlertType alertType;
    private Alert.Severity severity;
    private String sourceService;
    private String sourceId;
    private String title;
    private String message;
    private String metadata;
    private Alert.AlertStatus status;
    private Boolean notificationSent;
    private String acknowledgedBy;
    private LocalDateTime acknowledgedAt;
    private String resolvedBy;
    private LocalDateTime resolvedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
