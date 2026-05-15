import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';

export interface OrderItem {
  productId: number;
  sku: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  customerName: string;
  customerEmail: string;
  status: string;
  items: OrderItem[];
  itemCount: number;
  totalAmount: number;
  shippingAddress: string;
  billingAddress: string;
  warehouseId: string;
  priority: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  customerId: number;
  customerName: string;
  customerEmail?: string;
  items: { productId: number; quantity: number; unitPrice: number }[];
  shippingAddress: string;
  billingAddress?: string;
  tenantId?: string;
  warehouseId?: string;
  priority?: string;
  notes?: string;
}

// Fetch all orders (by customer or all via tenant)
export const useOrders = (customerId?: number) => {
  return useQuery<Order[]>({
    queryKey: customerId ? ['orders', 'customer', customerId] : ['orders'],
    queryFn: async () => {
      try {
        const url = customerId
          ? `/api/orders/customer/${customerId}`
          : '/api/orders';
        const res = await apiClient.get(url);
        // Normalise: add itemCount from items array length if backend doesn't return it
        const data: Order[] = res.data;
        return data.map(o => ({ ...o, itemCount: o.itemCount ?? o.items?.length ?? 0 }));
      } catch (e) {
        return [];
      }
    },
  });
};

// Fetch single order by id
export const useOrderById = (id: number) => {
  return useQuery<Order>({
    queryKey: ['orders', id],
    queryFn: async () => {
      try {
        const res = await apiClient.get(`/api/orders/${id}`);
        return res.data;
      } catch (e) {
        return null;
      }
    },
    enabled: !!id,
  });
};

// Create order
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) =>
      apiClient.post('/api/orders', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

// Update order status
export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiClient.put(`/api/orders/${id}/status`, null, { params: { status } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

// Cancel order
export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/api/orders/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};
