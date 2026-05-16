package org.example.warehousemcs.repository;

import org.example.warehousemcs.model.Zone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ZoneRepository extends JpaRepository<Zone, Long> {
    List<Zone> findByWarehouseIdAndTenantId(Long warehouseId, String tenantId);
    List<Zone> findByTenantId(String tenantId);
}
