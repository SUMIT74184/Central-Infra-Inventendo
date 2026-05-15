import React from "react";
import {
  Shield,
  Building2,
  Users,
  Package,
  ShoppingCart,
  Server,
  Activity,
  TrendingUp,
  AlertTriangle,
  Globe,
  Cpu,
  HardDrive,
  Wifi,
  Database,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const systemMetrics = [
  { label: "Total Tenants", value: "1,247", change: "+23", trend: "up", period: "this month", icon: Building2 },
  { label: "Active Users", value: "98,432", change: "+2.8k", trend: "up", period: "this week", icon: Users },
  { label: "Total SKUs", value: "12.4M", change: "+340k", trend: "up", period: "this month", icon: Package },
  { label: "Orders/Day", value: "284K", change: "+12%", trend: "up", period: "vs last month", icon: ShoppingCart },
  { label: "API Uptime", value: "99.99%", change: "0%", trend: "neutral", period: "Last 30 days", icon: Server },
  { label: "Avg Response", value: "42ms", change: "-8ms", trend: "up", period: "P99: 180ms", icon: Activity },
];

const serviceHealth = [
  { name: "Auth Service", status: "healthy", latency: "12ms", uptime: "99.99%", icon: Shield },
  { name: "Inventory Service", status: "healthy", latency: "38ms", uptime: "99.98%", icon: Package },
  { name: "Order Service", status: "healthy", latency: "45ms", uptime: "99.99%", icon: ShoppingCart },
  { name: "Warehouse Service", status: "degraded", latency: "120ms", uptime: "99.95%", icon: HardDrive },
  { name: "Tenant Service", status: "healthy", latency: "15ms", uptime: "99.99%", icon: Building2 },
  { name: "Billing Service", status: "healthy", latency: "52ms", uptime: "99.97%", icon: Database },
];

const infrastructureMetrics = [
  { label: "CPU Usage", value: "34%", icon: Cpu, color: "text-success" },
  { label: "Memory", value: "62%", icon: HardDrive, color: "text-warning" },
  { label: "Network I/O", value: "2.4 Gbps", icon: Wifi, color: "text-info" },
  { label: "DB Connections", value: "847/2000", icon: Database, color: "text-primary" },
];

const topTenants = [
  { name: "GlobalTech Corp", users: 2450, skus: 890000, orders: 45000, mrr: "$12,400", status: "Enterprise", health: 98 },
  { name: "RetailMax Inc", users: 1800, skus: 650000, orders: 38000, mrr: "$8,900", status: "Enterprise", health: 92 },
  { name: "FreshSupply Co", users: 920, skus: 420000, orders: 28000, mrr: "$5,200", status: "Business", health: 99 },
  { name: "AutoParts Hub", users: 560, skus: 380000, orders: 22000, mrr: "$3,800", status: "Business", health: 85 },
  { name: "MedEquip Direct", users: 340, skus: 180000, orders: 12000, mrr: "$2,400", status: "Pro", health: 97 },
];

const recentAlerts = [
  { message: "Tenant 'RetailMax' approaching storage limit (92%)", severity: "warning", time: "5 min ago" },
  { message: "Warehouse Service latency spike detected (120ms → 450ms)", severity: "error", time: "12 min ago" },
  { message: "New enterprise signup: 'LogiChain Solutions'", severity: "info", time: "1 hr ago" },
  { message: "Database replica lag > 500ms in us-east-2", severity: "warning", time: "2 hrs ago" },
  { message: "SSL certificate renewal for api.inventoryos.com", severity: "info", time: "3 hrs ago" },
  { message: "Rate limit threshold reached for tenant 'AutoParts Hub'", severity: "warning", time: "4 hrs ago" },
];

const revenueData = [
  { label: "MRR", value: "$284,200", change: "+8.4%" },
  { label: "ARR", value: "$3.41M", change: "+22.1%" },
  { label: "Churn Rate", value: "1.2%", change: "-0.3%" },
  { label: "ARPU", value: "$227", change: "+5.6%" },
];

const severityStyle: Record<string, string> = {
  warning: "bg-warning/10 text-warning border-warning/20",
  error: "bg-destructive/10 text-destructive border-destructive/20",
  info: "bg-info/10 text-info border-info/20",
};

const statusStyle: Record<string, string> = {
  healthy: "bg-success",
  degraded: "bg-warning",
  down: "bg-destructive",
};

const AdminDashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" /> System Administration
          </h1>
          <p className="text-sm text-muted-foreground">Platform-wide monitoring, tenant management, and infrastructure health</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg border bg-success/10 px-3 py-1.5">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-success">All Systems Operational</span>
          </div>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {systemMetrics.map((m) => (
          <div key={m.label} className="metric-card">
            <div className="flex items-center justify-between mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                <m.icon className="h-4 w-4 text-accent-foreground" />
              </div>
              {m.trend !== "neutral" && (
                <span className={`flex items-center gap-0.5 text-xs font-medium ${m.trend === "up" ? "text-success" : "text-destructive"}`}>
                  {m.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {m.change}
                </span>
              )}
            </div>
            <div className="text-xl font-bold text-foreground">{m.value}</div>
            <div className="text-xs text-muted-foreground">{m.label}</div>
            <div className="text-[10px] text-muted-foreground/60 mt-0.5">{m.period}</div>
          </div>
        ))}
      </div>

      {/* Service Health + Infrastructure */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Service Health */}
        <div className="lg:col-span-2 bg-card rounded-lg border shadow-card">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="section-title flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" /> Microservice Health
            </h2>
            <span className="text-xs text-muted-foreground">Auto-refreshes every 30s</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
            {serviceHealth.map((svc) => (
              <div key={svc.name} className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                    <svc.icon className="h-4 w-4 text-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{svc.name}</p>
                    <p className="text-xs text-muted-foreground">Latency: {svc.latency} · Uptime: {svc.uptime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-2.5 w-2.5 rounded-full ${statusStyle[svc.status]}`} />
                  <span className={`text-xs font-medium capitalize ${svc.status === "healthy" ? "text-success" : svc.status === "degraded" ? "text-warning" : "text-destructive"}`}>
                    {svc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Infrastructure */}
        <div className="space-y-4">
          <div className="bg-card rounded-lg border shadow-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Cpu className="h-4 w-4 text-muted-foreground" /> Infrastructure
            </h3>
            <div className="space-y-4">
              {infrastructureMetrics.map((inf) => (
                <div key={inf.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <inf.icon className={`h-3.5 w-3.5 ${inf.color}`} />
                      {inf.label}
                    </span>
                    <span className="text-xs font-medium text-foreground">{inf.value}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full ${inf.label === "Memory" ? "bg-warning" : "bg-primary"}`}
                      style={{ width: inf.value.includes("%") ? inf.value : "42%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-card rounded-lg border shadow-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-muted-foreground" /> Revenue
            </h3>
            <div className="space-y-3">
              {revenueData.map((r) => (
                <div key={r.label} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{r.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{r.value}</span>
                    <span className={`text-xs font-medium ${r.change.startsWith("-") ? "text-success" : "text-success"}`}>{r.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Tenants + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Tenants */}
        <div className="lg:col-span-2 bg-card rounded-lg border shadow-card">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="section-title flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" /> Top Tenants by Revenue
            </h2>
            <a href="/admin/tenants" className="text-sm text-primary hover:underline">View all</a>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Tenant</th>
                  <th>Users</th>
                  <th>SKUs</th>
                  <th>Orders/Mo</th>
                  <th>MRR</th>
                  <th>Plan</th>
                  <th>Health</th>
                </tr>
              </thead>
              <tbody>
                {topTenants.map((t) => (
                  <tr key={t.name}>
                    <td className="font-medium">{t.name}</td>
                    <td>{t.users.toLocaleString()}</td>
                    <td>{t.skus.toLocaleString()}</td>
                    <td>{t.orders.toLocaleString()}</td>
                    <td className="font-medium">{t.mrr}</td>
                    <td><span className="status-badge bg-primary/10 text-primary">{t.status}</span></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-12 rounded-full bg-secondary">
                          <div
                            className={`h-full rounded-full ${t.health >= 95 ? "bg-success" : t.health >= 90 ? "bg-warning" : "bg-destructive"}`}
                            style={{ width: `${t.health}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{t.health}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-card rounded-lg border shadow-card">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="section-title flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" /> System Alerts
            </h2>
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-warning text-[10px] font-bold text-warning-foreground">
              {recentAlerts.length}
            </span>
          </div>
          <div className="divide-y max-h-[400px] overflow-y-auto">
            {recentAlerts.map((alert, i) => (
              <div key={i} className="px-4 py-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-start gap-2">
                  <span className={`mt-0.5 inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase ${severityStyle[alert.severity]}`}>
                    {alert.severity}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-snug">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
