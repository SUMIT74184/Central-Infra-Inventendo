package com.app.alertsvc.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertEventDTO {
    private String tenantId;
    private String alertType;
    private String severity;
    private String sourceService;
    private String sourceId;
    private String title;
    private String message;
    private String metadata;
    private Long timestamp;
}
