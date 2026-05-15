import React, { useState } from "react";
import {
  Bot, Plus, Settings, Play, Pause, MoreHorizontal, Eye, Edit, Trash2, Copy,
  Package, ShoppingCart, ArrowLeftRight, Warehouse, Brain, Zap, Shield,
  BarChart3, Clock, CheckCircle2, AlertTriangle, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

const agentTypes = [
  {
    id: "AGT-001", name: "Reorder Agent", type: "Procurement", icon: Package,
    desc: "Automatically generates purchase orders when stock falls below reorder points. Analyzes lead times and demand forecasts.",
    status: "active", executions: 12400, successRate: 99.2, lastRun: "2 min ago",
    permissions: ["inventory.read", "orders.create", "suppliers.read"],
    config: { checkInterval: "15 min", batchSize: 50, approvalRequired: false },
  },
  {
    id: "AGT-002", name: "Demand Forecaster", type: "Analytics", icon: BarChart3,
    desc: "Uses historical data and ML models to predict demand patterns. Provides weekly forecasts per SKU per warehouse.",
    status: "active", executions: 840, successRate: 97.8, lastRun: "1 hr ago",
    permissions: ["inventory.read", "orders.read", "analytics.write"],
    config: { forecastWindow: "12 weeks", model: "ARIMA + XGBoost", confidence: 0.95 },
  },
  {
    id: "AGT-003", name: "Warehouse Optimizer", type: "Operations", icon: Warehouse,
    desc: "Optimizes bin placement, pick paths, and zone allocations based on order patterns and item velocity.",
    status: "active", executions: 2100, successRate: 98.5, lastRun: "30 min ago",
    permissions: ["warehouse.read", "warehouse.write", "inventory.read"],
    config: { optimizeFrequency: "daily", algorithm: "genetic", maxIterations: 1000 },
  },
  {
    id: "AGT-004", name: "Order Router", type: "Fulfillment", icon: ShoppingCart,
    desc: "Routes incoming orders to optimal warehouses based on proximity, stock availability, and shipping costs.",
    status: "active", executions: 284000, successRate: 99.8, lastRun: "Just now",
    permissions: ["orders.read", "orders.update", "warehouse.read", "inventory.read"],
    config: { strategy: "cost-optimized", maxSplitShipments: 3, priorityOverride: true },
  },
  {
    id: "AGT-005", name: "Stock Transfer Agent", type: "Logistics", icon: ArrowLeftRight,
    desc: "Automates inter-warehouse transfers to balance inventory across locations based on regional demand.",
    status: "paused", executions: 890, successRate: 96.4, lastRun: "2 days ago",
    permissions: ["inventory.read", "inventory.write", "movements.create", "warehouse.read"],
    config: { balanceThreshold: "20%", minTransferQty: 50, scheduleWindow: "off-peak" },
  },
  {
    id: "AGT-006", name: "Anomaly Detector", type: "Security", icon: Shield,
    desc: "Monitors inventory patterns for unusual activities — shrinkage, phantom inventory, and unauthorized movements.",
    status: "active", executions: 48000, successRate: 99.9, lastRun: "5 min ago",
    permissions: ["inventory.read", "movements.read", "alerts.create", "audit.read"],
    config: { sensitivityLevel: "high", windowSize: "7 days", alertThreshold: 2.5 },
  },
];

const statusStyle: Record<string, string> = {
  active: "bg-success/10 text-success",
  paused: "bg-warning/10 text-warning",
  error: "bg-destructive/10 text-destructive",
  disabled: "bg-muted text-muted-foreground",
};

const AdminAgentsPage: React.FC = () => {
  const [addOpen, setAddOpen] = useState(false);
  const [detailAgent, setDetailAgent] = useState<typeof agentTypes[0] | null>(null);
  const [newAgent, setNewAgent] = useState({ name: "", type: "", desc: "" });

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bot className="h-6 w-6 text-primary" /> Inventory Agents
          </h1>
          <p className="text-sm text-muted-foreground">
            {agentTypes.filter((a) => a.status === "active").length} active agents · Managed by Super Admin
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.info("Refreshing agent statuses...")}>
            <RefreshCw className="h-4 w-4 mr-1" /> Refresh
          </Button>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Create Agent
          </Button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Active Agents", value: agentTypes.filter((a) => a.status === "active").length, icon: CheckCircle2, color: "text-success", bg: "bg-success/10" },
          { label: "Total Executions", value: "348K", icon: Zap, color: "text-primary", bg: "bg-primary/10" },
          { label: "Avg Success Rate", value: "98.6%", icon: BarChart3, color: "text-info", bg: "bg-info/10" },
          { label: "Paused Agents", value: agentTypes.filter((a) => a.status === "paused").length, icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
        ].map((s) => (
          <div key={s.label} className="metric-card flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.bg}`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {agentTypes.map((agent) => (
          <div key={agent.id} className="bg-card rounded-lg border shadow-card p-5 hover:border-primary/30 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                  <agent.icon className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground">{agent.name}</h3>
                    <span className={`status-badge ${statusStyle[agent.status]}`}>{agent.status}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{agent.type} · {agent.id}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setDetailAgent(agent)}><Eye className="h-4 w-4 mr-2" /> View Details</DropdownMenuItem>
                  <DropdownMenuItem><Edit className="h-4 w-4 mr-2" /> Edit Configuration</DropdownMenuItem>
                  <DropdownMenuItem><Copy className="h-4 w-4 mr-2" /> Duplicate Agent</DropdownMenuItem>
                  {agent.status === "active" ? (
                    <DropdownMenuItem onClick={() => toast.info(`Pausing ${agent.name}`)}><Pause className="h-4 w-4 mr-2" /> Pause</DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => toast.success(`Resumed ${agent.name}`)}><Play className="h-4 w-4 mr-2" /> Resume</DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive"><Trash2 className="h-4 w-4 mr-2" /> Delete Agent</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{agent.desc}</p>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-secondary p-2">
                <div className="text-sm font-bold text-foreground">{agent.executions.toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground">Executions</div>
              </div>
              <div className="rounded-lg bg-secondary p-2">
                <div className="text-sm font-bold text-foreground">{agent.successRate}%</div>
                <div className="text-[10px] text-muted-foreground">Success Rate</div>
              </div>
              <div className="rounded-lg bg-secondary p-2">
                <div className="text-sm font-bold text-foreground flex items-center justify-center gap-1">
                  <Clock className="h-3 w-3" /> {agent.lastRun}
                </div>
                <div className="text-[10px] text-muted-foreground">Last Run</div>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-1">
              {agent.permissions.map((p) => (
                <span key={p} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-mono text-muted-foreground">{p}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Create Agent Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Agent</DialogTitle>
            <DialogDescription>Define a new inventory automation agent. Only Super Admins can create agents.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => { e.preventDefault(); toast.success(`Agent "${newAgent.name}" created`); setAddOpen(false); setNewAgent({ name: "", type: "", desc: "" }); }} className="space-y-4">
            <div className="space-y-2"><Label>Agent Name</Label><Input placeholder="Restock Optimizer" value={newAgent.name} onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })} required /></div>
            <div className="space-y-2">
              <Label>Agent Type</Label>
              <Select value={newAgent.type} onValueChange={(v) => setNewAgent({ ...newAgent, type: v })}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Procurement">Procurement</SelectItem>
                  <SelectItem value="Analytics">Analytics</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Fulfillment">Fulfillment</SelectItem>
                  <SelectItem value="Logistics">Logistics</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Description</Label><Input placeholder="What does this agent do?" value={newAgent.desc} onChange={(e) => setNewAgent({ ...newAgent, desc: e.target.value })} required /></div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
              <Button type="submit"><Bot className="h-4 w-4 mr-1" /> Create Agent</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Agent Detail Dialog */}
      <Dialog open={!!detailAgent} onOpenChange={() => setDetailAgent(null)}>
        <DialogContent className="sm:max-w-[550px]">
          {detailAgent && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <detailAgent.icon className="h-5 w-5 text-primary" /> {detailAgent.name}
                </DialogTitle>
                <DialogDescription>{detailAgent.type} Agent · {detailAgent.id}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">{detailAgent.desc}</p>
                <div>
                  <h4 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Configuration</h4>
                  <div className="rounded-lg bg-secondary p-3 space-y-1.5">
                    {Object.entries(detailAgent.config).map(([key, val]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-muted-foreground font-mono text-xs">{key}</span>
                        <span className="text-foreground font-medium text-xs">{String(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">Permissions</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {detailAgent.permissions.map((p) => (
                      <span key={p} className="rounded-md border bg-muted px-2 py-1 text-xs font-mono text-foreground">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailAgent(null)}>Close</Button>
                <Button><Settings className="h-4 w-4 mr-1" /> Edit Config</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminAgentsPage;
