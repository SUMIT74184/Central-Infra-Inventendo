import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';

export interface InventoryItem {
  id: number;
  sku: string;
  productName: string;
  quantity: number;
  description: string;
  reservedQuantity: number;
  availableQuantity: number;
  reorderLevel: number;
  maxStockLevel: number;
  unitPrice: number;
  warehouseId: string;
  warehouseName: string;
  category: string;
  location: string;
  status: string;
  lowstock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInventoryPayload {
  sku: string;
  productName: string;
  description: string;
  quantity: number;
  reorderLevel: number;
  maxStockLevel: number;
  unitPrice: number;
  warehouseId: string;
  warehouseName: string;
  category: string;
  location?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// Fetch all inventory (Paginated)
export const useInventory = (page: number = 0, size: number = 20) => {
  return useQuery<PaginatedResponse<InventoryItem>>({
    queryKey: ['inventory', page, size],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/api/v1/inventory', { params: { page, size } });
        return res.data;
      } catch (e) {
        return { content: [], totalPages: 0, totalElements: 0, size, number: page };
      }
    },
  });
};

// Fetch inventory by SKU
export const useInventoryBySku = (sku: string) => {
  return useQuery<InventoryItem>({
    queryKey: ['inventory', sku],
    queryFn: async () => {
      try {
        const res = await apiClient.get(`/api/v1/inventory/${sku}`);
        return res.data;
      } catch (e) {
        return null;
      }
    },
    enabled: !!sku,
  });
};

// Fetch low-stock items
export const useLowStockInventory = () => {
  return useQuery<InventoryItem[]>({
    queryKey: ['inventory', 'low-stock'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/api/v1/inventory/low-stock');
        return res.data;
      } catch (e) {
        return [];
      }
    },
  });
};

// Create new inventory item
export const useCreateInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateInventoryPayload) =>
      apiClient.post('/api/v1/inventory', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};

// Update quantity
export const useUpdateInventoryQuantity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sku, quantity }: { sku: string; quantity: number }) =>
      apiClient.put(`/api/v1/inventory/${sku}/quantity`, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};

// Update full inventory item
export const useUpdateInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sku, payload }: { sku: string; payload: Partial<CreateInventoryPayload> }) =>
      apiClient.put(`/api/v1/inventory/${sku}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};

// Delete inventory item
export const useDeleteInventory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sku: string) => apiClient.delete(`/api/v1/inventory/${sku}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
};
