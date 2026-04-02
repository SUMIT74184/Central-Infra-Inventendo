package org.example.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TenantValidationResponse {
    private Long id;
    private String tenantCode;
    private String tenantName;
    private String status;
    private String subscriptionTier;

    /**
     * Tenant is valid if status is ACTIVE.
     */
    public boolean isValid() {
        return "ACTIVE".equalsIgnoreCase(status);
    }
}
