package org.example.service;

import org.example.dto.TenantValidationResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "tenant-service",
        url = "${tenant.service.url}",
        fallback = TenantClientFallback.class)
public interface TenantClient {

    @GetMapping("/api/v1/tenants/{tenantCode}")
    TenantValidationResponse validateTenant(@PathVariable String tenantCode);
}
