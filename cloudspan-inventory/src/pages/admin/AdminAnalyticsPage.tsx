import React, { useState } from "react";
import {
  BarChart3, TrendingUp, Users, Package, ShoppingCart, Globe, ArrowUpRight, ArrowDownRight,
  Calendar, Building2, DollarSign, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const revenueData = [
  { month: "Sep", revenue: 198000, users: 78000 },
  { month: "Oct", revenue: 215000, users: 82000 },
  { month: "Nov", revenue: 232000, users: 86000 },
  { month: "Dec", revenue: 248000, users: 89000 },
  { month: "Jan", revenue: 261000, users: 92000 },
  { month: "Feb", revenue: 274000, users: 95000 },
  { month: "Mar", revenue: 284200, users: 98432 },
];

const orderVolumeData = [
  { day: "Mon", orders: 42000, fulfilled: 39800 },
  { day: "Tue", orders: 45200, fulfilled: 43100 },
  { day: "Wed", orders: 38900, fulfilled: 37200 },
  { day: "Thu", orders: 51200, fulfilled: 48900 },
  { day: "Fri", orders: 48700, fulfilled: 46300 },
  { day: "Sat", orders: 32100, fulfilled: 31200 },
  { day: "Sun", orders: 26100, fulfilled: 25400 },
];

const warehouseUtilization = [
  { name: "WH-East", utilization: 85, items: 12400 },
  { name: "WH-Central", utilization: 62, items: 8900 },
  { name: "WH-West", utilization: 91, items: 15200 },
  { name: "WH-South", utilization: 45, items: 6300 },
  { name: "WH-EU", utilization: 73, items: 9800 },
  { name: "WH-APAC", utilization: 58, items: 7600 },
];

const tenantDistribution = [
  { name: "Enterprise", value: 127, color: "hsl(212, 100%, 47%)" },
  { name: "Business", value: 438, color: "hsl(212, 80%, 60%)" },
  { name: "Pro", value: 312, color: "hsl(212, 60%, 72%)" },
  { name: "Starter", value: 370, color: "hsl(212, 40%, 82%)" },
];

const apiLatencyData = [
  { time: "00:00", p50: 18, p95: 42, p99: 120 },
  { time: "04:00", p50: 15, p95: 38, p99: 95 },
  { time: "08:00", p50: 22, p95: 55, p99: 180 },
  { time: "12:00", p50: 28, p95: 68, p99: 210 },
  { time: "16:00", p50: 25, p95: 60, p99: 190 },
  { time: "20:00", p50: 20, p95: 48, p99: 150 },
  { time: "23:59", p50: 16, p95: 40, p99: 110 },
];

const regionData = [
  { region: "North America", tenants: 520, revenue: "$142K", growth: "+12%" },
  { region: "Europe", tenants: 380, revenue: "$86K", growth: "+18%" },
  { region: "Asia Pacific", tenants: 210, revenue: "$38K", growth: "+32%" },
  { region: "Latin America", tenants: 89, revenue: "$12K", growth: "+24%" },
  { region: "Middle East & Africa", tenants: 48, revenue: "$6K", growth: "+41%" },
];

const kpis = [
  { label: "Total Revenue (MRR)", value: "$284,200", change: "+8.4%", trend: "up", icon: DollarSign },
  { label: "Active Tenants", value: "1,247", change: "+23", trend: "up", icon: Building2 },
  { label: "Total Users", value: "98,432", change: "+2.8K", trend: "up", icon: Users },
  { label: "Orders Today", value: "284K", change: "+12%", trend: "up", icon: ShoppingCart },
  { label: "Avg Fulfillment", value: "4.2 hrs", change: "-18min", trend: "up", icon: Activity },
  { label: "Churn Rate", value: "1.2%", change: "-0.3%", trend: "up", icon: TrendingUp },
];

const AdminAnalyticsPage: React.FC = () => {
  const [period, setPeriod] = useState("30d");

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" /> Platform Analytics
          </h1>
          <p className="text-sm text-muted-foreground">Comprehensive metrics across all tenants and services</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm"><Calendar className="h-4 w-4 mr-1" /> Custom Range</Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="metric-card">
            <div className="flex items-center justify-between mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
                <k.icon className="h-4 w-4 text-accent-foreground" />
              </div>
              <span className="flex items-center gap-0.5 text-xs font-medium text-success">
                {k.trend === "up" ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {k.change}
              </span>
            </div>
            <div className="text-xl font-bold text-foreground">{k.value}</div>
            <div className="text-xs text-muted-foreground">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Revenue + Tenant Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-lg border shadow-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" /> Revenue & User Growth
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(212, 100%, 47%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(212, 100%, 47%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 20%)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(215, 15%, 55%)" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(215, 15%, 55%)" }} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(215, 28%, 14%)", border: "1px solid hsl(215, 20%, 25%)", borderRadius: "8px", color: "#fff" }} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(212, 100%, 47%)" fill="url(#revGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg border shadow-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" /> Tenant Distribution
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={tenantDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value">
                {tenantDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "hsl(215, 28%, 14%)", border: "1px solid hsl(215, 20%, 25%)", borderRadius: "8px", color: "#fff" }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {tenantDistribution.map((t) => (
              <div key={t.name} className="flex items-center gap-2 text-xs">
                <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: t.color }} />
                <span className="text-muted-foreground">{t.name}</span>
                <span className="font-medium text-foreground ml-auto">{t.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders + Warehouse Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border shadow-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-muted-foreground" /> Order Volume (This Week)
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={orderVolumeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 20%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(215, 15%, 55%)" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(215, 15%, 55%)" }} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(215, 28%, 14%)", border: "1px solid hsl(215, 20%, 25%)", borderRadius: "8px", color: "#fff" }} />
              <Legend />
              <Bar dataKey="orders" fill="hsl(212, 100%, 47%)" radius={[4, 4, 0, 0]} name="Total Orders" />
              <Bar dataKey="fulfilled" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} name="Fulfilled" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg border shadow-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Package className="h-4 w-4 text-muted-foreground" /> Warehouse Utilization
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={warehouseUtilization} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 20%)" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: "hsl(215, 15%, 55%)" }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "hsl(215, 15%, 55%)" }} width={70} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(215, 28%, 14%)", border: "1px solid hsl(215, 20%, 25%)", borderRadius: "8px", color: "#fff" }} formatter={(v: number) => `${v}%`} />
              <Bar dataKey="utilization" radius={[0, 4, 4, 0]}>
                {warehouseUtilization.map((entry, i) => (
                  <Cell key={i} fill={entry.utilization > 85 ? "hsl(38, 92%, 50%)" : "hsl(212, 100%, 47%)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* API Latency + Regional Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-lg border shadow-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" /> API Response Latency (ms)
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={apiLatencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(215, 20%, 20%)" />
              <XAxis dataKey="time" tick={{ fontSize: 12, fill: "hsl(215, 15%, 55%)" }} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(215, 15%, 55%)" }} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(215, 28%, 14%)", border: "1px solid hsl(215, 20%, 25%)", borderRadius: "8px", color: "#fff" }} />
              <Legend />
              <Line type="monotone" dataKey="p50" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={false} name="P50" />
              <Line type="monotone" dataKey="p95" stroke="hsl(212, 100%, 47%)" strokeWidth={2} dot={false} name="P95" />
              <Line type="monotone" dataKey="p99" stroke="hsl(38, 92%, 50%)" strokeWidth={2} dot={false} name="P99" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-lg border shadow-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" /> Regional Distribution
          </h3>
          <div className="space-y-3">
            {regionData.map((r) => (
              <div key={r.region} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">{r.region}</p>
                  <p className="text-xs text-muted-foreground">{r.tenants} tenants · {r.revenue} MRR</p>
                </div>
                <span className="text-xs font-medium text-success">{r.growth}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsPage;
