import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('inv_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Inject X-Tenant-Id for downstream microservices that require it (e.g. Warehouse, Alert)
    try {
      const authStore = localStorage.getItem('inv-auth-store');
      if (authStore && config.headers) {
        const state = JSON.parse(authStore).state;
        if (state && state.tenantId) {
          config.headers['X-Tenant-Id'] = state.tenantId;
        }
      }
    } catch (e) {
      // ignore JSON parse errors
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
