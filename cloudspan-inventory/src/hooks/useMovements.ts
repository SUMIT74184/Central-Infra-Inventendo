import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';

export type MovementType = 'IN' | 'OUT' | 'TRANSFER' | 'ADJUSTMENT' | 'DAMAGED' | 'RETURNED' | 'RESERVED';
export type MovementStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface StockMovement {
  id: number;
  // From BaseEntity
  tenantId?: string;
  createdAt: string;
  updatedAt: string;
  // Fields
  productId: number;
  warehouseId: number;
  movementType: MovementType;
  quantity: number;
  unitPrice: number;
  fromLocation: string;
  toLocation: string;
  reason: string;
  referenceNumber: string;
  performedBy: string;
  idempotencyKey: string;
  status: MovementStatus;
  // Enriched on frontend from inventory cache
  sku?: string;
  productName?: string;
}

export interface CreateMovementPayload {
  productId: number;    // resolved from sku via useInventoryBySku
  warehouseId: number;
  movementType: string;
  quantity: number;
  unitPrice?: number;
  fromLocation: string;
  toLocation: string;
  reason?: string;
  referenceNumber?: string;
  performedBy: string;
  idempotencyKey?: string;
}

export const useMovements = () => {
  return useQuery<StockMovement[]>({
    queryKey: ['movements'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/api/v1/movements');
        return res.data;
      } catch (e) {
        return [];
      }
    },
  });
};

export const useCreateMovement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMovementPayload) =>
      apiClient.post('/api/v1/movements', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movements'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};

/**
 * Helper: enriches a list of movements with sku + productName
 * by joining against the inventory cache passed in from useInventory().
 */
export const enrichMovementsWithProductInfo = (
  movements: StockMovement[],
  inventoryItems: { id: number; sku: string; productName: string }[]
): StockMovement[] => {
  const productMap = new Map(inventoryItems.map(i => [i.id, i]));
  return movements.map(m => {
    const product = productMap.get(m.productId);
    return {
      ...m,
      sku: product?.sku ?? String(m.productId),
      productName: product?.productName ?? 'Unknown',
    };
  });
};
