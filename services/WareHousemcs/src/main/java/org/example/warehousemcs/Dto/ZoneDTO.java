package org.example.warehousemcs.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ZoneDTO {
    private Long id;
    private String zoneCode;
    private String name;
    private String description;
    private String type;
    private Double capacity;
    private Boolean active;
}
