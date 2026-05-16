package com.app.alertsvc.controllers;

import com.app.alertsvc.dto.AlertDTO;
import com.app.alertsvc.dto.CreateAlertRequest;
import com.app.alertsvc.entity.Alert;
import com.app.alertsvc.entity.AlertRule;
import com.app.alertsvc.repositories.AlertRuleRepository;
import com.app.alertsvc.services.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import jakarta.validation.Valid;
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
    private final AlertRuleRepository alertRuleRepository;

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

    @PostMapping("/test")
    public ResponseEntity<AlertDTO> triggerTestAlert(@RequestBody Map<String, String> payload) {
        String tenantId = payload.get("tenantId");
        Alert alert = new Alert();
        alert.setTenantId(tenantId);
        alert.setAlertType(Alert.AlertType.THRESHOLD_BREACH);
        alert.setSeverity(Alert.Severity.LOW);
        alert.setSourceService("TEST_CLIENT");
        alert.setSourceId("TC-001");
        alert.setTitle("System Connection Test");
        alert.setMessage("This is a manually triggered test alert to verify connectivity.");
        alert.setStatus(Alert.AlertStatus.PENDING);
        return ResponseEntity.status(HttpStatus.CREATED).body(alertService.createAlert(alert));
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

    // ── Alert Rules ──────────────────────────────────────────────────────────

    @GetMapping("/rules")
    public ResponseEntity<List<AlertRule>> getRules(
            @RequestHeader("X-Tenant-Id") String tenantId) {
        return ResponseEntity.ok(alertRuleRepository.findByTenantId(tenantId));
    }

    @PostMapping("/rules")
    public ResponseEntity<AlertRule> createRule(
            @RequestHeader("X-Tenant-Id") String tenantId,
            @RequestBody AlertRule rule) {
        rule.setTenantId(tenantId);
        return ResponseEntity.status(HttpStatus.CREATED).body(alertRuleRepository.save(rule));
    }

    @PutMapping("/rules/{id}/toggle")
    public ResponseEntity<AlertRule> toggleRule(@PathVariable Long id) {
        return alertRuleRepository.findById(id).map(rule -> {
            rule.setEnabled(!rule.getEnabled());
            return ResponseEntity.ok(alertRuleRepository.save(rule));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/rules/{id}")
    public ResponseEntity<Void> deleteRule(@PathVariable Long id) {
        alertRuleRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }

}
