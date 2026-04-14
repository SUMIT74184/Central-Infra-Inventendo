package com.app.alertsvc.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "alert_rules")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String tenantId;

    @Column(nullable = false, length = 200)
    private String name;

    /** Human-readable condition e.g. "Quantity < Reorder Point" */
    @Column(nullable = false, columnDefinition = "TEXT")
    private String condition;

    /** CRITICAL, WARNING, INFO */
    @Column(nullable = false, length = 20)
    private String severity;

    /** Which resource the rule targets — "All SKUs", "All Warehouses", etc. */
    @Column(length = 200)
    private String targets;

    /** Notification channels — "Email + Dashboard", "SMS + Email + Slack" */
    @Column(length = 300)
    private String action;

    @Column(nullable = false)
    @Builder.Default
    private Boolean enabled = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
