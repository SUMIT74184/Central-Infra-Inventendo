package com.app.alertsvc.repositories;
import com.app.alertsvc.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {

    List<Alert> findByTenantIdOrderByCreatedAtDesc(String tenantId);

    List<Alert> findByTenantIdAndStatusOrderByCreatedAtDesc(String tenantId, Alert.AlertStatus status);

    List<Alert> findByTenantIdAndAlertTypeOrderByCreatedAtDesc(String tenantId, Alert.AlertType alertType);

    List<Alert> findByTenantIdAndSeverityOrderByCreatedAtDesc(String tenantId, Alert.Severity severity);

    @Query("SELECT a FROM Alert a WHERE a.tenantId = ?1 AND a.status = 'PENDING' AND a.severity IN ('HIGH', 'CRITICAL') ORDER BY a.createdAt DESC")
    List<Alert> findCriticalPendingAlerts(String tenantId);

    @Query("SELECT a FROM Alert a WHERE a.tenantId = ?1 AND a.createdAt >= ?2 ORDER BY a.createdAt DESC")
    List<Alert> findRecentAlerts(String tenantId, LocalDateTime since);

    Long countByTenantIdAndStatus(String tenantId, Alert.AlertStatus status);

    Long countByTenantIdAndSeverity(String tenantId, Alert.Severity severity);

    @Query("SELECT COUNT(a) FROM Alert a WHERE a.tenantId = ?1 AND a.status = 'PENDING'")
    Long countPendingAlerts(String tenantId);
}