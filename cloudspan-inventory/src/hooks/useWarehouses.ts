import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';

export interface Warehouse {
  id: number;
  warehouseCode: string;
  name: string;
  location: string;
  status: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  managerName: string;
  email: string;
  capacity: number;
  currentUtilization: number;
  type: string;     // distribution, fulfillment, cold-storage, cross-dock
  zones: number;
  staffCount: number;
  tenantId: string;
  contactNumber: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWarehousePayload {
  warehouseCode?: string;
  name: string;
  location: string;
  status?: string;
  managerName?: string;
  capacity: number;
  currentUtilization?: number;
  type: string;
  zones?: number;
  staffCount?: number;
  tenantId?: string;
}

export const useWarehouses = () => {
  return useQuery<Warehouse[]>({
    queryKey: ['warehouses'],
    queryFn: async () => {
      try {
        const res = await apiClient.get('/api/v1/warehouses');
        return res.data;
      } catch (e) {
        return [];
      }
    },
  });
};

export const useWarehouseById = (id: number) => {
  return useQuery<Warehouse>({
    queryKey: ['warehouses', id],
    queryFn: async () => {
      try {
        const res = await apiClient.get(`/api/v1/warehouses/${id}`);
        return res.data;
      } catch (e) {
        return null;
      }
    },
    enabled: !!id,
  });
};

export const useCreateWarehouse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateWarehousePayload) =>
      apiClient.post('/api/v1/warehouses', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
    },
  });
};

export const useUpdateWarehouse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<CreateWarehousePayload> }) =>
      apiClient.put(`/api/v1/warehouses/${id}`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
    },
  });
};

export const useDeleteWarehouse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/api/v1/warehouses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
    },
  });
};
