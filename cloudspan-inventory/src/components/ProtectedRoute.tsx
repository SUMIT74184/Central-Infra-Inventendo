import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { UserRole } from "@/stores/authStore";
import DashboardLayout from "@/components/DashboardLayout";

interface ProtectedRouteProps {
  /** Which roles are allowed to enter this route group */
  allowedRoles?: UserRole[];
}

/** Maps a role to its default landing page */
const roleHome: Record<UserRole, string> = {
  super_admin: "/super-admin",
  admin: "/admin",
  tenant: "/dashboard",
};

/**
 * ProtectedRoute — acts as the Auth Middleware for the frontend.
 *
 * Behaviour:
 *  1. Not logged in            → redirect to /login (preserves the attempted URL via `state`)
 *  2. Logged in, wrong role    → redirect to their own home panel
 *  3. Logged in, correct role  → render DashboardLayout + child routes
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  const location = useLocation();

  // While the Zustand store is rehydrating from localStorage
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // Not authenticated → go to login, remember where the user was trying to go
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user?.role;

  // Authenticated but not allowed in this panel → bounce to their panel
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to={roleHome[userRole] ?? "/dashboard"} replace />;
  }

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
};

export default ProtectedRoute;
