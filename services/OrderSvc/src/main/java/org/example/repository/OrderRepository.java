package org.example.repository;

import org.example.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order,Long> {

    Optional<Order> findByOrderNumberAndTenantId(String orderNumber, String tenantId);

    List<Order> findByTenantId(String tenantId);

    List<Order> findByCustomerIdAndTenantId(Long customerId, String tenantId);

    List<Order> findByStatus(Order.OrderStatus status);

    List<Order> findByCreatedAtBetween(LocalDateTime startDate,LocalDateTime endDate);

    List<Order> findByCustomerIdAndStatus(Long customerId,Order.OrderStatus status);

    boolean existsByOrderNumber(String orderNumber);
}
