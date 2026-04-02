package com.app.alertsvc.controllers;

import com.app.alertsvc.dto.AlertDTO;
import com.app.alertsvc.dto.CreateAlertRequest;
import com.app.alertsvc.entity.Alert;
import com.app.alertsvc.services.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @PostMapping
    public ResponseEntity<AlertDTO> createAlert(@Valid @RequestBody CreateAlertRequest request) {
        Alert alert = Alert.builder()
                .tenantId(request.getTenantId())
                .alertType(request.getAlertType())
                .severity(request.getSeverity())
                .sourceService(request.getSourceService())
                .sourceId(request.getSourceId())
                .title(request.getTitle())
                .message(request.getMessage())
                .metadata(request.getMetadata())
                .build();

        AlertDTO createdAlert = alertService.createAlert(alert);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdAlert);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AlertDTO> getAlert(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-Id") String tenantId) {
        AlertDTO alert = alertService.getAlertById(id, tenantId);
        return ResponseEntity.ok(alert);
    }

    @GetMapping("/tenant/{tenantId}")
    public ResponseEntity<List<AlertDTO>> getAlertsByTenant(@PathVariable String tenantId) {
        List<AlertDTO> alerts = alertService.getAlertsByTenant(tenantId);
        return ResponseEntity.ok(alerts);
    }

    @GetMapping("/tenant/{tenantId}/status/{status}")
    public ResponseEntity<List<AlertDTO>> getAlertsByStatus(
            @PathVariable String tenantId,
            @PathVariable Alert.AlertStatus status) {
        List<AlertDTO> alerts = alertService.getAlertsByStatus(tenantId, status);
        return ResponseEntity.ok(alerts);
    }

    @GetMapping("/tenant/{tenantId}/critical")
    public ResponseEntity<List<AlertDTO>> getCriticalAlerts(@PathVariable String tenantId) {
        List<AlertDTO> alerts = alertService.getCriticalAlerts(tenantId);
        return ResponseEntity.ok(alerts);
    }

    @GetMapping("/tenant/{tenantId}/recent")
    public ResponseEntity<List<AlertDTO>> getRecentAlerts(
            @PathVariable String tenantId,
            @RequestParam(defaultValue = "24") int hours) {
        List<AlertDTO> alerts = alertService.getRecentAlerts(tenantId, hours);
        return ResponseEntity.ok(alerts);
    }

    @PutMapping("/{id}/acknowledge")
    public ResponseEntity<AlertDTO> acknowledgeAlert(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-Id") String tenantId,
            @RequestBody Map<String, String> request) {
        String acknowledgedBy = request.get("acknowledgedBy");
        AlertDTO alert = alertService.acknowledgeAlert(id, tenantId, acknowledgedBy);
        return ResponseEntity.ok(alert);
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<AlertDTO> resolveAlert(
            @PathVariable Long id,
            @RequestHeader("X-Tenant-Id") String tenantId,
            @RequestBody Map<String, String> request) {
        String resolvedBy = request.get("resolvedBy");
        AlertDTO alert = alertService.resolveAlert(id, tenantId, resolvedBy);
        return ResponseEntity.ok(alert);
    }

    @GetMapping("/tenant/{tenantId}/count/pending")
    public ResponseEntity<Map<String, Long>> getPendingCount(@PathVariable String tenantId) {
        Long count = alertService.getPendingAlertCount(tenantId);
        return ResponseEntity.ok(Map.of("pendingAlerts", count));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }

}
