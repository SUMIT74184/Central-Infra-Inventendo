import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import useAuthStore from "@/stores/authStore";
import { useAlerts } from "@/hooks/useAlerts";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Warehouse,
  ArrowLeftRight,
  CreditCard,
  Users,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Search,
  Menu,
  Building2,
  BarChart3,
  Bot,
  Crown,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GlobalSearch from "@/components/GlobalSearch";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const tenantNavItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Inventory", path: "/dashboard/inventory", icon: Package },
  { label: "Orders", path: "/dashboard/orders", icon: ShoppingCart },
  { label: "Warehouses", path: "/dashboard/warehouses", icon: Warehouse },
  { label: "Movements", path: "/dashboard/movements", icon: ArrowLeftRight },
  { label: "Alerts", path: "/dashboard/alerts", icon: Bell },
  { label: "Billing", path: "/dashboard/billing", icon: CreditCard },
  { label: "Settings", path: "/dashboard/settings", icon: Settings },
];

const adminNavItems = [
  { label: "Admin Overview", path: "/admin", icon: Shield },
  { label: "Analytics", path: "/admin/analytics", icon: BarChart3 },
  { label: "Tenants", path: "/admin/tenants", icon: Building2 },
  { label: "All Inventory", path: "/admin/inventory", icon: Package },
  { label: "All Orders", path: "/admin/orders", icon: ShoppingCart },
  { label: "Users", path: "/admin/users", icon: Users },
  { label: "Agents", path: "/admin/agents", icon: Bot },
  { label: "Billing", path: "/admin/billing", icon: CreditCard },
  { label: "System Settings", path: "/admin/settings", icon: Settings },
];

const superAdminNavItems = [
  { label: "Command Center", path: "/super-admin", icon: Crown },
  { label: "Platform Analytics", path: "/super-admin/analytics", icon: BarChart3 },
  { label: "Tenants", path: "/super-admin/tenants", icon: Building2 },
  { label: "Admin Users", path: "/super-admin/admins", icon: Shield },
  { label: "All Users", path: "/super-admin/users", icon: Users },
  { label: "Agent Fleet", path: "/super-admin/agents", icon: Bot },
  { label: "Global Inventory", path: "/super-admin/inventory", icon: Package },
  { label: "Global Orders", path: "/super-admin/orders", icon: ShoppingCart },
  { label: "Alert Service", path: "/super-admin/alerts", icon: Bell },
  { label: "Revenue & Billing", path: "/super-admin/billing", icon: CreditCard },
  { label: "Platform Settings", path: "/super-admin/settings", icon: Settings },
];

const roleBadge: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  super_admin: { label: "Super Admin", icon: Crown, className: "bg-primary/20 text-primary" },
  admin: { label: "Admin", icon: Shield, className: "bg-info/20 text-info" },
  tenant: { label: "Tenant", icon: Globe, className: "bg-success/20 text-success" },
};

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const tenantId = useAuthStore((s) => s.tenantId) ?? "";
  const { data: alertsData = [] } = useAlerts(tenantId);
  const unacknowledgedCount = alertsData.filter((a) => a.status === "PENDING").length;

  // Ctrl+K / Cmd+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const navItems =
    user?.role === "super_admin"
      ? superAdminNavItems
      : user?.role === "admin"
        ? adminNavItems
        : tenantNavItems;

  const badge = roleBadge[user?.role || "tenant"];

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col bg-nav transition-all duration-200
          lg:relative lg:z-auto
          ${collapsed ? "w-16" : "w-64"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-3 border-b border-sidebar-border px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary">
            <Package className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-base font-bold text-primary-foreground truncate">
              InventoryOS
            </span>
          )}
        </div>

        {/* Role badge */}
        {!collapsed && (
          <div className="px-3 pt-3 pb-1">
            <div className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold ${badge.className}`}>
              <badge.icon className="h-3 w-3" />
              {badge.label}
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`nav-item ${isActive ? "active" : ""} ${collapsed ? "justify-center px-2" : ""}`}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>

        {/* User section */}
        <div className="border-t border-sidebar-border p-3">
          {!collapsed && (
            <div className="mb-2 px-1">
              <p className="text-sm font-medium text-primary-foreground truncate">
                {user?.name}
              </p>
              <p className="text-xs text-nav-foreground/60 truncate">{user?.email}</p>
              {user?.tenantName && (
                <p className="mt-1 text-xs text-nav-active truncate">{user.tenantName}</p>
              )}
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={logout}
            className={`w-full text-nav-foreground hover:text-primary-foreground hover:bg-nav-hover ${collapsed ? "px-2" : "justify-start"}`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="ml-2">Sign out</span>}
          </Button>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex h-8 items-center justify-center border-t border-sidebar-border text-nav-foreground hover:text-primary-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b bg-card px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div
              className="relative hidden sm:block cursor-pointer"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <div className="w-80 pl-9 h-9 bg-secondary border-0 rounded-md flex items-center text-sm text-muted-foreground select-none">
                Search inventory, orders, warehouses...
                <kbd className="ml-auto mr-2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {unacknowledgedCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                      {unacknowledgedCount > 9 ? "9+" : unacknowledgedCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Alerts</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {alertsData.length > 0 ? (
                  alertsData.slice(0, 5).map(alert => (
                    <DropdownMenuItem key={alert.id} className="flex flex-col items-start gap-1 p-3 cursor-pointer" onClick={() => window.location.href = "/dashboard/alerts"}>
                      <span className="text-sm font-medium">{alert.title}</span>
                      <span className="text-xs text-muted-foreground truncate w-full">{alert.message}</span>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">No active alerts</div>
                )}
                {alertsData.length > 0 && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="justify-center text-primary cursor-pointer font-medium" onClick={() => window.location.href = "/dashboard/alerts"}>
                      View all alerts
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                  {user?.name?.charAt(0) || "U"}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer"><Users className="mr-2 h-4 w-4"/> Manage Users</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer"><Shield className="mr-2 h-4 w-4"/> Manage Roles</DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer"><Settings className="mr-2 h-4 w-4"/> Profile & Subscription</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive cursor-pointer" onClick={logout}><LogOut className="mr-2 h-4 w-4"/> Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Global Search Command Palette */}
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
};

export default DashboardLayout;
