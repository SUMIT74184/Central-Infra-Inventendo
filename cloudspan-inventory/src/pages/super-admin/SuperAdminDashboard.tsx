import React from "react";
import {
  Crown,
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
  Shield,
  Bot,
  Zap,
  Lock,
} from "lucide-react";

const platformKPIs = [
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
  { name: "Movement Service", status: "healthy", latency: "28ms", uptime: "99.98%", icon: Activity },
  { name: "Alert Service", status: "healthy", latency: "18ms", uptime: "99.99%", icon: AlertTriangle },
];

const infrastructureMetrics = [
  { label: "CPU Usage", value: "34%", icon: Cpu, color: "text-success" },
  { label: "Memory", value: "62%", icon: HardDrive, color: "text-warning" },
  { label: "Network I/O", value: "2.4 Gbps", icon: Wifi, color: "text-info" },
  { label: "DB Connections", value: "847/2000", icon: Database, color: "text-primary" },
];

const revenueData = [
  { label: "MRR", value: "$284,200", change: "+8.4%" },
  { label: "ARR", value: "$3.41M", change: "+22.1%" },
  { label: "Churn Rate", value: "1.2%", change: "-0.3%" },
  { label: "ARPU", value: "$227", change: "+5.6%" },
];

const agentOverview = [
  { name: "Reorder Agent", activeInstances: 342, tasksToday: 1820, status: "running", type: "automation" },
  { name: "Forecast Agent", activeInstances: 128, tasksToday: 450, status: "running", type: "analytics" },
  { name: "Anomaly Detector", activeInstances: 89, tasksToday: 2100, status: "running", type: "monitoring" },
  { name: "Sync Agent", activeInstances: 56, tasksToday: 890, status: "paused", type: "integration" },
];

const adminUsers = [
  { name: "Sarah Kim", email: "sarah@inventoryos.io", role: "Admin", region: "US-East", lastActive: "2 min ago" },
  { name: "James Liu", email: "james@inventoryos.io", role: "Admin", region: "EU-West", lastActive: "15 min ago" },
  { name: "Priya Patel", email: "priya@inventoryos.io", role: "Admin", region: "AP-South", lastActive: "1 hr ago" },
];

const recentAlerts = [
  { message: "Tenant 'RetailMax' approaching storage limit (92%)", severity: "warning", time: "5 min ago" },
  { message: "Warehouse Service latency spike detected (120ms → 450ms)", severity: "error", time: "12 min ago" },
  { message: "New enterprise signup: 'LogiChain Solutions'", severity: "info", time: "1 hr ago" },
  { message: "Database replica lag > 500ms in us-east-2", severity: "warning", time: "2 hrs ago" },
  { message: "SSL certificate renewal for api.inventoryos.com", severity: "info", time: "3 hrs ago" },
  { message: "Rate limit threshold reached for tenant 'AutoParts Hub'", severity: "warning", time: "4 hrs ago" },
];

const topTenants = [
  { name: "GlobalTech Corp", users: 2450, skus: 890000, orders: 45000, mrr: "$12,400", plan: "Enterprise", health: 98 },
  { name: "RetailMax Inc", users: 1800, skus: 650000, orders: 38000, mrr: "$8,900", plan: "Enterprise", health: 92 },
  { name: "FreshSupply Co", users: 920, skus: 420000, orders: 28000, mrr: "$5,200", plan: "Business", health: 99 },
  { name: "AutoParts Hub", users: 560, skus: 380000, orders: 22000, mrr: "$3,800", plan: "Business", health: 85 },
  { name: "MedEquip Direct", users: 340, skus: 180000, orders: 12000, mrr: "$2,400", plan: "Pro", health: 97 },
];

const severityStyle: Record<string, string> = {
  warning: "bg-warning/10 text-warning border-warning/20",
  error: "bg-destructive/10 text-destructive border-destructive/20",
  info: "bg-info/10 text-info border-info/20",
};

const statusDot: Record<string, string> = {
  healthy: "bg-success",
  degraded: "bg-warning",
  down: "bg-destructive",
  running: "bg-success",
  paused: "bg-warning",
};

const SuperAdminDashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Crown className="h-6 w-6 text-primary" /> Super Admin Command Center
          </h1>
          <p className="text-sm text-muted-foreground">
            Full platform control — infrastructure, tenants, agents, and revenue
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border bg-success/10 px-3 py-1.5">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-success">All Systems Operational</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border bg-primary/10 px-3 py-1.5">
            <Lock className="h-3 w-3 text-primary" />
            <span className="text-xs font-medium text-primary">Super Admin Access</span>
          </div>
        </div>
      </div>

      {/* Platform KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {platformKPIs.map((m) => (
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

      {/* Microservice Health + Infrastructure + Revenue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                  <div className={`h-2.5 w-2.5 rounded-full ${statusDot[svc.status]}`} />
                  <span className={`text-xs font-medium capitalize ${svc.status === "healthy" ? "text-success" : "text-warning"}`}>
                    {svc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

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
                      <inf.icon className={`h-3.5 w-3.5 ${inf.color}`} /> {inf.label}
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
                    <span className="text-xs font-medium text-success">{r.change}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Agent Overview + Admin Users */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border shadow-card">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="section-title flex items-center gap-2">
              <Bot className="h-5 w-5 text-muted-foreground" /> Agent Fleet Overview
            </h2>
            <a href="/super-admin/agents" className="text-sm text-primary hover:underline">Manage</a>
          </div>
          <div className="divide-y">
            {agentOverview.map((agent) => (
              <div key={agent.name} className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                    <Zap className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.activeInstances} instances · {agent.tasksToday} tasks today</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${statusDot[agent.status]}`} />
                  <span className={`text-xs font-medium capitalize ${agent.status === "running" ? "text-success" : "text-warning"}`}>
                    {agent.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-lg border shadow-card">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="section-title flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" /> Admin Users
            </h2>
            <a href="/super-admin/admins" className="text-sm text-primary hover:underline">Manage</a>
          </div>
          <div className="divide-y">
            {adminUsers.map((admin) => (
              <div key={admin.email} className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {admin.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{admin.name}</p>
                    <p className="text-xs text-muted-foreground">{admin.email} · {admin.region}</p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">{admin.lastActive}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Tenants + System Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-lg border shadow-card">
          <div className="flex items-center justify-between px-5 py-4 border-b">
            <h2 className="section-title flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-muted-foreground" /> Top Tenants
            </h2>
            <a href="/super-admin/tenants" className="text-sm text-primary hover:underline">View all</a>
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
                    <td><span className="status-badge bg-primary/10 text-primary">{t.plan}</span></td>
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

export default SuperAdminDashboard;
