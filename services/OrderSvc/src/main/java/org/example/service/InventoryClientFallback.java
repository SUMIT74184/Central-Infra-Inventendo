package org.example.service;

import org.example.dto.InventoryResponse;
import org.springframework.stereotype.Component;

// import java.math.BigDecimal;

@Component
public class InventoryClientFallback implements InventoryClient {
    @Override
    public InventoryResponse getInventory(Long productId) {
        return InventoryResponse.builder()
                .productId(productId)
                .productName("Mock Product")
                .sku("MOCK-SKU")
                .price(java.math.BigDecimal.TEN)
                .inStock(true)
                .availableQuantity(100)
                .build();
    }

    @Override
    public boolean reserveInventory(Long productId, Integer quantity) {
        return true;
    }

    @Override
    public void releaseInventory(Long productId, Integer quantity) {
        // Do nothing
    }
}
