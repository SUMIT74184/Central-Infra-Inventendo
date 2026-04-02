package org.example.service;

import org.example.dto.TenantValidationResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class TenantClientFallback implements TenantClient {

    @Override
    public TenantValidationResponse validateTenant(String tenantCode) {
        log.warn("Tenant service unavailable — fallback activated for tenant: {}. Assuming valid.", tenantCode);
        return TenantValidationResponse.builder()
                .tenantCode(tenantCode)
                .tenantName("Fallback Tenant")
                .status("ACTIVE")
                .subscriptionTier("BASIC")
                .build();
    }
}
