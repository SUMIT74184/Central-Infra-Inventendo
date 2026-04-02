package com.app.alertsvc.dto;

import com.app.alertsvc.entity.Alert;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateAlertRequest {

    @NotBlank(message = "Tenant ID is required")
    private String tenantId;

    @NotNull(message = "Alert type is required")
    private Alert.AlertType alertType;

    @NotNull(message = "Severity is required")
    private Alert.Severity severity;

    @NotBlank(message = "Source service is required")
    private String sourceService;

    private String sourceId;

    @NotBlank(message = "Title is required")
    private String title;

    private String message;

    private String metadata;








}
