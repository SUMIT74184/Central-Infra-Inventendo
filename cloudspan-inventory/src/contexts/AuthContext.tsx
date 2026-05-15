import React, { createContext, useContext } from "react";
import { useAuthStore, type AuthUser, type UserRole, type RegisterPayload } from "@/stores/authStore";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  // login: (email: string, passcode: string) => Promise<void>;
  // loginWithProvider: (provider: "google" | "facebook") => Promise<void>;
  // logout: () => void;
  isLoading: boolean;
  /** Real backend password login */
  login: (email: string, password: string) => Promise<void>;
  /** Real backend registration */
  register: (payload: RegisterPayload) => Promise<void>;
  /** Calls /api/auth/logout and clears local state */
  logout: () => Promise<void>;
  /** Role helpers */
  isTenant: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export type { AuthUser, UserRole };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const store = useAuthStore();
  const role = store.user?.role;

  return (
    <AuthContext.Provider
      value={{
        user: store.user,
        isAuthenticated: store.isAuthenticated,
        isLoading: store.isLoading,
        login: store.login,
        register: store.register,
        logout: store.logout,
        isTenant: role === "tenant",
        isAdmin: role === "admin",
        isSuperAdmin: role === "super_admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
