import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import useAuthStore from '../stores/authStore';

export type AlertSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AlertStatus = 'PENDING' | 'ACKNOWLEDGED' | 'RESOLVED' | 'IGNORED';

export interface Alert {
  id: number;
  tenantId: string;
  alertType: string;
  severity: AlertSeverity;
  sourceService: string;
  sourceId: string;
  title: string;
  message: string;
  status: AlertStatus;
  notificationSent: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AlertRule {
  id: number;
  tenantId: string;
  name: string;
  condition: string;
  severity: string;
  targets: string;
  action: string;
  enabled: boolean;
  createdAt: string;
}

const getTenantHeader = () => {
  const tenantId = useAuthStore.getState().tenantId;
  return tenantId ? { 'X-Tenant-Id': tenantId } : {};
};

export const useAlerts = (tenantId: string) => {
  return useQuery<Alert[]>({
    queryKey: ['alerts', tenantId],
    queryFn: async () => {
      const res = await apiClient.get(`/api/v1/alerts/tenant/${tenantId}`);
      return res.data;
    },
    enabled: !!tenantId,
  });
};

export const useAlertRules = () => {
  return useQuery<AlertRule[]>({
    queryKey: ['alert-rules'],
    queryFn: async () => {
      const res = await apiClient.get('/api/v1/alerts/rules', {
        headers: getTenantHeader(),
      });
      return res.data;
    },
  });
};

export const useCreateAlertRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (rule: Partial<AlertRule>) =>
      apiClient.post('/api/v1/alerts/rules', rule, {
        headers: getTenantHeader(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-rules'] });
    },
  });
};

export const useToggleAlertRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) =>
      apiClient.put(`/api/v1/alerts/rules/${id}/toggle`, {}, {
        headers: getTenantHeader(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert-rules'] });
    },
  });
};

export const useAcknowledgeAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, acknowledgedBy }: { id: number; acknowledgedBy: string }) =>
      apiClient.put(`/api/v1/alerts/${id}/acknowledge`, { acknowledgedBy }, {
        headers: getTenantHeader(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};

export const useCreateAlert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (alert: Partial<Alert>) =>
      apiClient.post('/api/v1/alerts', alert, {
        headers: getTenantHeader(),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });
};
