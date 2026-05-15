import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardHome from "./pages/dashboard/DashboardHome";
import InventoryPage from "./pages/dashboard/InventoryPage";
import OrdersPage from "./pages/dashboard/OrdersPage";
import WarehousesPage from "./pages/dashboard/WarehousesPage";
import MovementsPage from "./pages/dashboard/MovementsPage";
import BillingPage from "./pages/dashboard/BillingPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import AlertsPage from "./pages/dashboard/AlertsPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTenantsPage from "./pages/admin/AdminTenantsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminAnalyticsPage from "./pages/admin/AdminAnalyticsPage";
import AdminAgentsPage from "./pages/admin/AdminAgentsPage";
import SuperAdminDashboard from "./pages/super-admin/SuperAdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Tenant routes */}
            <Route element={<ProtectedRoute allowedRoles={["tenant"]} />}>
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/dashboard/inventory" element={<InventoryPage />} />
              <Route path="/dashboard/orders" element={<OrdersPage />} />
              <Route path="/dashboard/warehouses" element={<WarehousesPage />} />
              <Route path="/dashboard/movements" element={<MovementsPage />} />
              <Route path="/dashboard/alerts" element={<AlertsPage />} />
              <Route path="/dashboard/billing" element={<BillingPage />} />
              <Route path="/dashboard/settings" element={<SettingsPage />} />
            </Route>

            {/* Admin routes */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
              <Route path="/admin/tenants" element={<AdminTenantsPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/agents" element={<AdminAgentsPage />} />
              <Route path="/admin/inventory" element={<InventoryPage />} />
              <Route path="/admin/orders" element={<OrdersPage />} />
              <Route path="/admin/billing" element={<BillingPage />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
            </Route>

            {/* Super Admin routes */}
            <Route element={<ProtectedRoute allowedRoles={["super_admin"]} />}>
              <Route path="/super-admin" element={<SuperAdminDashboard />} />
              <Route path="/super-admin/analytics" element={<AdminAnalyticsPage />} />
              <Route path="/super-admin/tenants" element={<AdminTenantsPage />} />
              <Route path="/super-admin/admins" element={<AdminUsersPage />} />
              <Route path="/super-admin/users" element={<AdminUsersPage />} />
              <Route path="/super-admin/agents" element={<AdminAgentsPage />} />
              <Route path="/super-admin/inventory" element={<InventoryPage />} />
              <Route path="/super-admin/orders" element={<OrdersPage />} />
              <Route path="/super-admin/alerts" element={<AlertsPage />} />
              <Route path="/super-admin/billing" element={<BillingPage />} />
              <Route path="/super-admin/settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
