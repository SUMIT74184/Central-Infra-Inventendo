package org.example.warehousemcs.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.example.warehousemcs.Dto.WarehouseAssignedEvent;
import org.example.warehousemcs.Dto.WarehouseDTO;
import org.example.warehousemcs.Dto.WarehouseRequest;
import org.example.warehousemcs.model.Warehouse;
import org.example.warehousemcs.repository.WarehouseRepository;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WarehouseServiceImpl implements WarehouseService {

    private final WarehouseRepository warehouseRepository;
    private final org.example.warehousemcs.repository.ZoneRepository zoneRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;
    private final RedisTemplate<String, Object> redisTemplate;
    // private final ObjectMapper objectMapper;

    private static final String WAREHOUSE_EVENTS_TOPIC = "warehouse-events";
    private static final String WAREHOUSE_ASSIGNED_TOPIC = "warehouse-assigned";
    private static final String CACHE_PREFIX = "warehouse";

    @Override
    @Transactional
    @CacheEvict(value = "warehouses", allEntries = true)
    public WarehouseDTO createWarehouse(WarehouseRequest req, String tenantId) {
        log.info("Creating warehouse:{}", req.getWarehouseCode());

        if (warehouseRepository.existsByWarehouseCodeAndTenantId(
                req.getWarehouseCode(), tenantId)) {
            throw new RuntimeException("Warehouse with code " + req.getWarehouseCode() + "already exists");

        }

        Warehouse warehouse = mapToEntity(req);
        warehouse.setTenantId(tenantId);
        warehouse.setActive(true);
        Warehouse savedWarehouse = warehouseRepository.save(warehouse);

        WarehouseDTO dto = mapToDTO(savedWarehouse);
        cacheWarehouse(dto);
        publishWarehouseEvent("WAREHOUSE_CREATED", dto);

        return dto;
    }

    @Override
    @Transactional
    @CacheEvict(value = "warehouses", allEntries = true)
    public WarehouseDTO updateWarehouse(Long id, WarehouseRequest request, String tenantId) {
        log.info("Updating warehouse: {}", id);

        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        if (!warehouse.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Unauthorized access to warehouse");
        }

        updateWarehouseFields(warehouse, request);
        Warehouse updateWarehouse = warehouseRepository.save(warehouse);

        WarehouseDTO dto = mapToDTO(updateWarehouse);
        cacheWarehouse(dto);
        publishWarehouseEvent("WAREHOUSE_UPDATED", dto);

        return dto;
    }

    @Override
    @Cacheable(value = "warehouses", key = "#id + '-' + #tenantId")
    public WarehouseDTO getWarehouseById(Long id, String tenantId) {
        log.info("Fetching warehouse by ID: {}", id);

        String cacheKey = CACHE_PREFIX + id + ":" + tenantId;
        WarehouseDTO cached = (WarehouseDTO) redisTemplate.opsForValue().get(cacheKey);

        if (cached != null) {
            log.info("Warehouse found in cache");
            return cached;
        }

        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        if (!warehouse.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Unauthorized access to warehouse");
        }

        WarehouseDTO dto = mapToDTO(warehouse);
        cacheWarehouse(dto);
        return dto;
    }

    @Override
    @Cacheable(value = "warehouses", key = "#warehouseCode + '-' + #tenantId")
    public WarehouseDTO getWarehouseByCode(String warehouseCode, String tenantId) {
        log.info("Fetching warehouse by code: {}", warehouseCode);

        Warehouse warehouse = warehouseRepository.findByWarehouseCodeAndTenantId(warehouseCode, tenantId)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        return mapToDTO(warehouse);
    }

    @Override
    public List<WarehouseDTO> getAllWarehouses(String tenantId) {
        log.info("Fetching all warehouses for tenant: {}", tenantId);

        return warehouseRepository.findByTenantId((tenantId))
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<WarehouseDTO> getActiveWarehouses(String tenantId) {
        log.info("Fetching active warehouses for tenant: {}", tenantId);

        return warehouseRepository.findByTenantIdAndActive(tenantId, true)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<WarehouseDTO> getWarehouseByStatus(String tenantId, String status) {
        log.info("Fetching warehouses by status: {} for tenant:{}", status, tenantId);

        return warehouseRepository.findByTenantIdAndStatus(tenantId, status)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public List<WarehouseDTO> getWarehousesByLocation(String tenantId, String location) {

        return warehouseRepository.findByTenantIdAndLocation(tenantId, location)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<WarehouseDTO> getAvailableWarehouses(String tenantId) {
        log.info("Fetching available warehouses for tenant: {}", tenantId);

        return warehouseRepository.findAvailableWarehouses(tenantId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    @CacheEvict(value = "warehouses", allEntries = true)
    public void deleteWarehouse(Long id, String tenantId) {
        log.info("Deleting warehouse: {}", id);

        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        if (!warehouse.getTenantId().equals(tenantId)) {
            throw new RuntimeException(("Unauthorized access to warehouse"));
        }

        warehouseRepository.delete(warehouse);
        evictCache(id, tenantId);
        publishWarehouseEvent("WAREHOUSE_DELETED", mapToDTO(warehouse));

    }

    @Override
    @Transactional
    @CacheEvict(value = "warehouses", allEntries = true)
    public void deactivateWarehouse(Long id, String tenantId) {
        log.info("Deactivating warehouse: {}", id);

        Warehouse warehouse = warehouseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        if (!warehouse.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Unauthorized access to warehouse");
        }

        warehouse.setActive(false);
        Warehouse deactivated = warehouseRepository.save(warehouse);
        WarehouseDTO dto = mapToDTO(deactivated);
        evictCache(id, tenantId);
        // publishWarehouseEvent("WAREHOUSE_DEACTIVATED",mapToDTO(warehouse));
        publishWarehouseEvent("WAREHOUSE_DEACTIVATED", dto);

    }

    private void publishWarehouseEvent(String eventType, WarehouseDTO warehouse) {
        WarehouseEvent event = new WarehouseEvent(eventType, warehouse);
        kafkaTemplate.send(WAREHOUSE_EVENTS_TOPIC, warehouse.getWarehouseCode(), event);
        log.info("Published {} event for warehouse: {}", eventType, warehouse.getWarehouseCode());
    }

    public void publishWarehouseAssignment(String orderId, WarehouseDTO warehouse) {
        WarehouseAssignedEvent assignmentEvent = WarehouseAssignedEvent.builder()
                .orderId(orderId)
                .tenantId(Long.parseLong(warehouse.getTenantId()))
                .productId(null) // Fill this if applicable
                .warehouseId(warehouse.getId())
                .warehouseCode(warehouse.getWarehouseCode())
                .assignedAt(LocalDateTime.now())
                .build();

        kafkaTemplate.send(WAREHOUSE_ASSIGNED_TOPIC, orderId, assignmentEvent);
        log.info("Published assignment event for Order: {} to topic: {}", orderId, WAREHOUSE_ASSIGNED_TOPIC);
    }

    @Override
    @Transactional
    public WarehouseDTO updateUtilization(String warehouseCode, String tenantId, Double utilizationChange) {
        log.info("Updating utilization for warehouse: {}", warehouseCode);

        Warehouse warehouse = warehouseRepository.findByWarehouseCodeAndTenantId(warehouseCode, tenantId)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        double newUtilization = warehouse.getCurrentUtilization() + utilizationChange;

        if (newUtilization < 0) {
            throw new RuntimeException("Utilization cannot be negative");
        }

        if (newUtilization > warehouse.getCapacity()) {
            throw new RuntimeException("Utilization exceeds warehouse capacity");
        }

        warehouse.setCurrentUtilization(newUtilization);
        Warehouse updatedWarehouse = warehouseRepository.save(warehouse);

        WarehouseDTO dto = mapToDTO(updatedWarehouse);
        cacheWarehouse(dto);
        publishWarehouseEvent("WAREHOUSE_UTILIZATION_UPDATED", dto);

        return dto;
    }

    private void cacheWarehouse(WarehouseDTO warehouse) {
        String cacheKey = CACHE_PREFIX + warehouse.getId() + ":" + warehouse.getTenantId();
        redisTemplate.opsForValue().set(cacheKey, warehouse, 1, TimeUnit.HOURS);

    }

    private void evictCache(Long id, String tenantId) {
        String cacheKey = CACHE_PREFIX + id + ":" + tenantId;
        redisTemplate.delete(cacheKey);
    }

    private void updateWarehouseFields(Warehouse warehouse, WarehouseRequest request) {
        warehouse.setName(request.getName());
        warehouse.setLocation(request.getLocation());
        warehouse.setAddress(request.getAddress());
        warehouse.setCity(request.getCity());
        warehouse.setStatus(request.getStatus());
        warehouse.setState(request.getState());
        warehouse.setCountry(request.getCountry());
        warehouse.setZipCode(request.getZipCode());
        warehouse.setManagerName(request.getManagerName());
        warehouse.setContactNumber(request.getContactNumber());
        warehouse.setCapacity(request.getCapacity());
        warehouse.setCurrentUtilization(request.getCurrentUtilization());
        warehouse.setEmail(request.getEmail());
        warehouse.setZonesCount(request.getZonesCount());
    }

    private Warehouse mapToEntity(WarehouseRequest request) {
        Warehouse warehouse = new Warehouse();
        warehouse.setWarehouseCode(request.getWarehouseCode());
        warehouse.setName(request.getName());
        warehouse.setLocation(request.getLocation());
        warehouse.setAddress(request.getAddress());
        warehouse.setState(request.getState());
        warehouse.setCity(request.getCity());
        warehouse.setCountry(request.getCountry());
        warehouse.setZipCode(request.getZipCode());
        warehouse.setManagerName(request.getManagerName());
        warehouse.setEmail(request.getEmail());
        warehouse.setCapacity(request.getCapacity());
        warehouse.setCurrentUtilization(request.getCurrentUtilization());
        warehouse.setStatus(request.getStatus());
        warehouse.setContactNumber(request.getContactNumber());
        warehouse.setZonesCount(request.getZonesCount());

        return warehouse;
    }

    private WarehouseDTO mapToDTO(Warehouse warehouse) {
        return new WarehouseDTO(
                warehouse.getId(),
                warehouse.getWarehouseCode(),
                warehouse.getName(),
                warehouse.getLocation(),
                warehouse.getAddress(),
                warehouse.getCity(),
                warehouse.getState(),
                warehouse.getCountry(),
                warehouse.getZipCode(),
                warehouse.getManagerName(),
                warehouse.getContactNumber(),
                warehouse.getEmail(),
                warehouse.getCapacity(),
                warehouse.getCurrentUtilization(),
                warehouse.getStatus(),
                warehouse.getZonesCount(),
                warehouse.getTenantId(),
                warehouse.getCreatedAt(),
                warehouse.getUpdatedAt(),
                warehouse.getActive());
    }

    @Override
    @Transactional
    public org.example.warehousemcs.Dto.ZoneDTO addZone(Long warehouseId, org.example.warehousemcs.Dto.ZoneDTO dto, String tenantId) {
        Warehouse warehouse = warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        if (!warehouse.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Unauthorized access");
        }

        org.example.warehousemcs.model.Zone zone = org.example.warehousemcs.model.Zone.builder()
                .zoneCode(dto.getZoneCode())
                .name(dto.getName())
                .description(dto.getDescription())
                .type(dto.getType())
                .capacity(dto.getCapacity())
                .active(true)
                .warehouse(warehouse)
                .tenantId(tenantId)
                .build();

        org.example.warehousemcs.model.Zone saved = zoneRepository.save(zone);
        
        // Update zonesCount
        warehouse.setZonesCount((warehouse.getZonesCount() == null ? 0 : warehouse.getZonesCount()) + 1);
        warehouseRepository.save(warehouse);

        return mapToZoneDTO(saved);
    }

    @Override
    public List<org.example.warehousemcs.Dto.ZoneDTO> getZones(Long warehouseId, String tenantId) {
        return zoneRepository.findByWarehouseIdAndTenantId(warehouseId, tenantId)
                .stream()
                .map(this::mapToZoneDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteZone(Long zoneId, String tenantId) {
        org.example.warehousemcs.model.Zone zone = zoneRepository.findById(zoneId)
                .orElseThrow(() -> new RuntimeException("Zone not found"));

        if (!zone.getTenantId().equals(tenantId)) {
            throw new RuntimeException("Unauthorized access");
        }

        Warehouse warehouse = zone.getWarehouse();
        zoneRepository.delete(zone);
        
        // Update zonesCount
        if (warehouse.getZonesCount() != null && warehouse.getZonesCount() > 0) {
            warehouse.setZonesCount(warehouse.getZonesCount() - 1);
            warehouseRepository.save(warehouse);
        }
    }

    private org.example.warehousemcs.Dto.ZoneDTO mapToZoneDTO(org.example.warehousemcs.model.Zone zone) {
        return org.example.warehousemcs.Dto.ZoneDTO.builder()
                .id(zone.getId())
                .zoneCode(zone.getZoneCode())
                .name(zone.getName())
                .description(zone.getDescription())
                .type(zone.getType())
                .capacity(zone.getCapacity())
                .active(zone.getActive())
                .build();
    }

    private record WarehouseEvent(String eventType, WarehouseDTO warehouse) {
    }
}
