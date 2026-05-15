import { create } from "zustand";
import { persist } from "zustand/middleware";
import apiClient from "../api/client";

export type UserRole = "super_admin" | "admin" | "tenant";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  tenantId?: string;
  tenantName?: string;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  tenantId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: AuthUser, token: string) => void;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  tenantId: string;
  roles?: string[];
}

/** Map backend roles array to a single frontend UserRole */
const mapRole = (roles: string[]): UserRole => {
  if (roles.includes("SUPER_ADMIN") || roles.includes("ROLE_SUPER_ADMIN")) return "super_admin";
  if (roles.includes("TENANT_ADMIN") || roles.includes("ROLE_ADMIN")) return "admin";
  return "tenant";
};

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      tenantId: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const res = await apiClient.post("/api/auth/login", { email, password });
          const { accessToken, userId, tenantId, roles, firstName, lastName } = res.data;

          const user: AuthUser = {
            id: userId,
            email,
            name: `${firstName ?? ""} ${lastName ?? ""}`.trim() || email.split("@")[0],
            role: mapRole(roles ?? []),
            tenantId,
          };

          // Store token in localStorage for the interceptor
          localStorage.setItem("inv_access_token", accessToken);

          set({ user, accessToken, tenantId, isAuthenticated: true, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      register: async (payload: RegisterPayload) => {
        set({ isLoading: true });
        try {
          await apiClient.post("/api/auth/register", payload);
          set({ isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: async () => {
        const token = get().accessToken;
        if (token) {
          try {
            await apiClient.post("/api/auth/logout", null, {
              headers: { Authorization: `Bearer ${token}` },
            });
          } catch {
            // ignore — still clear local state
          }
        }
        localStorage.removeItem("inv_access_token");
        set({ user: null, accessToken: null, tenantId: null, isAuthenticated: false });
      },

      setUser: (user: AuthUser, token: string) => {
        localStorage.setItem("inv_access_token", token);
        set({ user, accessToken: token, tenantId: user.tenantId ?? null, isAuthenticated: true });
      },
    }),
    {
      name: "inv-auth-store",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        tenantId: state.tenantId,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;

// Named export for backwards compatibility with existing code using `useAuthStore`
export { useAuthStore };
