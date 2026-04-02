package com.app.alertsvc.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "alerts", indexes = {
        @Index(name = "idx_tenant_id", columnList = "tenant_id"),
        @Index(name = "idx_status", columnList = "status"),
        @Index(name = "idx_created_at", columnList = "created_at")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Alert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tenant_id", nullable = false)
    private String tenantId;

    @Column(name = "alert_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private AlertType alertType;

    @Column(name = "severity", nullable = false)
    @Enumerated(EnumType.STRING)
    private Severity severity;

    @Column(name = "source_service", nullable = false)
    private String sourceService;

    @Column(name = "source_id")
    private String sourceId;

    @Column(name = "title", nullable = false, length = 500)
    private String title;

    @Column(name = "message", columnDefinition = "TEXT")
    private String message;

    @Column(name = "metadata", columnDefinition = "TEXT")
    private String metadata;

    @Column(name = "status", nullable = false)
    @Enumerated(EnumType.STRING)
    private AlertStatus status;

    @Column(name = "notification_sent", nullable = false)
    private Boolean notificationSent = false;

    @Column(name = "acknowledged_by")
    private String acknowledgedBy;

    @Column(name = "acknowledged_at")
    private LocalDateTime acknowledgedAt;

    @Column(name = "resolved_by")
    private String resolvedBy;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = AlertStatus.PENDING;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum AlertType {
        LOW_STOCK,
        OUT_OF_STOCK,
        ORDER_FAILED,
        PAYMENT_FAILED,
        WAREHOUSE_ISSUE,
        BILLING_OVERDUE,
        MOVEMENT_ANOMALY,
        SYSTEM_ERROR,
        THRESHOLD_BREACH
    }

    public enum Severity {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }

    public enum AlertStatus {
        PENDING,
        ACKNOWLEDGED,
        RESOLVED,
        IGNORED
    }
}
