import React from "react";
import {
  Package,
  ShoppingCart,
  Warehouse,
  ArrowLeftRight,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInventory, useLowStockInventory } from "@/hooks/useInventory";
import { useOrders } from "@/hooks/useOrders";
import { useWarehouses } from "@/hooks/useWarehouses";
import { useMovements } from "@/hooks/useMovements";
import { formatDistanceToNow, isToday } from "date-fns";

const statusColor: Record<string, string> = {
  PENDING: "bg-warning/10 text-warning",
  CONFIRMED: "bg-info/10 text-info",
  PROCESSING: "bg-info/10 text-info",
  SHIPPED: "bg-primary/10 text-primary",
  DELIVERED: "bg-success/10 text-success",
  CANCELLED: "bg-destructive/10 text-destructive",
  FAILED: "bg-destructive/10 text-destructive",
};

const DashboardHome: React.FC = () => {
  // Fetch data
  const { data: inventoryPage, isLoading: invLoading, isError: invError, refetch: refetchInv } = useInventory(0, 1);
  const { data: orders, isLoading: ordersLoading, isError: ordersError, refetch: refetchOrders } = useOrders();
  const { data: warehouses, isLoading: whLoading, isError: whError, refetch: refetchWh } = useWarehouses();
  const { data: movements, isLoading: movLoading, isError: movError, refetch: refetchMov } = useMovements();
  const { data: lowStockItems, isLoading: lowStockLoading } = useLowStockInventory();

  const isLoading = invLoading || ordersLoading || whLoading || movLoading || lowStockLoading;
  const isError = invError || ordersError || whError || movError;

  const refetchAll = () => {
    refetchInv();
    refetchOrders();
    refetchWh();
    refetchMov();
  };

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-64 gap-3">
        <p className="text-destructive font-medium">Failed to load dashboard data</p>
        <Button variant="outline" size="sm" onClick={refetchAll}>
          <RefreshCw className="h-4 w-4 mr-1" /> Retry
        </Button>
      </div>
    );
  }

  // Calculate metrics
  const totalSkus = inventoryPage?.totalElements || 0;
  const activeOrders = orders?.filter(o => !['DELIVERED', 'CANCELLED', 'FAILED'].includes(o.status)).length || 0;
  const totalWarehouses = warehouses?.length || 0;
  const movementsToday = movements?.filter(m => isToday(new Date(m.createdAt))).length || 0;

  const metrics = [
    { label: "Total SKUs", value: totalSkus.toLocaleString(), change: "+0%", trend: "neutral", icon: Package },
    { label: "Active Orders", value: activeOrders.toLocaleString(), change: "+0%", trend: "neutral", icon: ShoppingCart },
    { label: "Warehouses", value: totalWarehouses.toLocaleString(), change: "0%", trend: "neutral", icon: Warehouse },
    { label: "Movements Today", value: movementsToday.toLocaleString(), change: "+0%", trend: "neutral", icon: ArrowLeftRight },
  ];

  const recentOrders = orders?.slice(0, 5) || [];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Overview of your inventory operations</p>
        </div>
        <Button variant="ghost" size="sm" onClick={refetchAll} className="text-muted-foreground">
          <RefreshCw className="h-3 w-3 mr-1" /> Refresh
        </Button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="metric-card">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <m.icon className="h-5 w-5 text-accent-foreground" />
              </div>
              <span className={`flex items-center gap-1 text-xs font-medium ${m.trend === "up" ? "text-success" : m.trend === "down" ? "text-destructive" : "text-muted-foreground"}`}>
                {m.trend === "up" && <TrendingUp className="h-3 w-3" />}
                {m.trend === "down" && <TrendingDown className="h-3 w-3" />}
                {m.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-foreground">{m.value}</div>
            <div className="text-sm text-muted-foreground">{m.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-card rounded-lg border shadow-card">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="section-title flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Recent Orders
            </h2>
            <a href="/dashboard/orders" className="text-sm text-primary hover:underline">View all</a>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-mono text-xs">{order.orderNumber}</td>
                    <td>{order.customerName}</td>
                    <td>{order.itemCount}</td>
                    <td>
                      <span className={`status-badge ${statusColor[order.status] || "bg-muted text-muted-foreground"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="font-medium">${order.totalAmount.toLocaleString()}</td>
                    <td className="text-muted-foreground">
                      {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true })}
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">No recent orders</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-card rounded-lg border shadow-card">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="section-title flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              Low Stock Alerts
            </h2>
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-warning text-[10px] font-bold text-warning-foreground">
              {lowStockItems?.length || 0}
            </span>
          </div>
          <div className="divide-y max-h-[400px] overflow-y-auto">
            {lowStockItems?.map((item) => (
              <div key={item.sku} className="px-5 py-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.productName}</p>
                    <p className="text-xs text-muted-foreground">{item.sku} · {item.warehouseName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-destructive">{item.quantity}</p>
                    <p className="text-xs text-muted-foreground">min: {item.reorderLevel}</p>
                  </div>
                </div>
              </div>
            ))}
            {(!lowStockItems || lowStockItems.length === 0) && (
              <div className="px-5 py-8 text-center text-muted-foreground text-sm">
                No low stock alerts
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
