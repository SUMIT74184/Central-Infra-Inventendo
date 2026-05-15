import React, { useState } from "react";
import {
  Bell, AlertTriangle, PackageX, Clock, Plus,
  Check, X, MoreHorizontal, ShieldAlert, Loader2, RefreshCw, Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useAlerts, useAlertRules, useAcknowledgeAlert, useCreateAlertRule, useToggleAlertRule, useCreateAlert, type Alert, type AlertRule } from "@/hooks/useAlerts";
import useAuthStore from "@/stores/authStore";

const severityIcon: Record<string, React.ReactNode> = {
  CRITICAL: <ShieldAlert className="h-4 w-4 text-destructive" />,
  HIGH:     <ShieldAlert className="h-4 w-4 text-destructive" />,
  WARNING:  <AlertTriangle className="h-4 w-4 text-warning" />,
  MEDIUM:   <AlertTriangle className="h-4 w-4 text-warning" />,
  INFO:     <Bell className="h-4 w-4 text-info" />,
  LOW:      <Bell className="h-4 w-4 text-info" />,
};

const severityStyle: Record<string, string> = {
  CRITICAL: "bg-destructive/10 text-destructive border-destructive/20",
  HIGH:     "bg-destructive/10 text-destructive border-destructive/20",
  WARNING:  "bg-warning/10 text-warning border-warning/20",
  MEDIUM:   "bg-warning/10 text-warning border-warning/20",
  INFO:     "bg-info/10 text-info border-info/20",
  LOW:      "bg-info/10 text-info border-info/20",
};

const AlertsPage: React.FC = () => {
  const tenantId = useAuthStore((s) => s.tenantId) ?? "";

  const { data: alertsData = [], isLoading: alertsLoading, isError: alertsError, refetch: refetchAlerts } = useAlerts(tenantId);
  const { data: rulesData = [], isLoading: rulesLoading, isError: rulesError, refetch: refetchRules } = useAlertRules();
  const acknowledge = useAcknowledgeAlert();
  const createRule = useCreateAlertRule();
  const toggleRule = useToggleAlertRule();
  const createAlert = useCreateAlert();

  const [tab, setTab] = useState<"active" | "rules">("active");
  const [addRuleOpen, setAddRuleOpen] = useState(false);
  const [ruleForm, setRuleForm] = useState({ name: "", condition: "", severity: "WARNING", action: "" });
  const userName = useAuthStore((s) => s.user?.name) ?? "Operator";

  const unacknowledgedCount = alertsData.filter((a) => a.status === "PENDING").length;

  const handleAcknowledgeAll = async () => {
    const pending = alertsData.filter((a) => a.status === "PENDING");
    await Promise.all(pending.map((a) => acknowledge.mutateAsync({ id: a.id, acknowledgedBy: userName })));
    toast.success("All alerts acknowledged");
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRule.mutateAsync(ruleForm);
      toast.success(`Rule "${ruleForm.name}" created`);
      setAddRuleOpen(false);
      setRuleForm({ name: "", condition: "", severity: "WARNING", action: "" });
    } catch {
      toast.error("Failed to create rule");
    }
  };

  const handleTestAlert = async () => {
    try {
      await createAlert.mutateAsync({
        tenantId,
        alertType: "LOW_STOCK",
        severity: "HIGH",
        sourceService: "SYSTEM_TEST",
        sourceId: `TEST-${Math.floor(Math.random() * 1000)}`,
        title: "Test Alert Generated",
        message: "This is a simulated alert generated from the dashboard to verify connectivity.",
        status: "PENDING"
      });
      toast.success("Test alert generated");
    } catch {
      toast.error("Failed to generate test alert");
    }
  };

  const isLoading = alertsLoading || rulesLoading;

  if (isLoading) return (
    <div className="p-6 flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Bell className="h-6 w-6 text-warning" /> Alert Center
          </h1>
          <p className="text-sm text-muted-foreground">
            {unacknowledgedCount > 0 ? `${unacknowledgedCount} unacknowledged alerts` : "All alerts acknowledged"} · {rulesData.filter((r) => r.enabled).length} active rules
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleTestAlert} disabled={createAlert.isPending}>
            <Bell className="h-4 w-4 mr-1" /> Test Alert
          </Button>
          <Button variant="outline" size="sm" onClick={handleAcknowledgeAll} disabled={unacknowledgedCount === 0}>
            <Check className="h-4 w-4 mr-1" /> Acknowledge All
          </Button>
          <Button size="sm" onClick={() => setAddRuleOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add Rule
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Critical", count: alertsData.filter((a) => a.severity === "CRITICAL" || a.severity === "HIGH").length, icon: ShieldAlert, color: "text-destructive", bg: "bg-destructive/10" },
          { label: "Warnings", count: alertsData.filter((a) => a.severity === "MEDIUM").length, icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
          { label: "Low Stock", count: alertsData.filter((a) => a.alertType === "LOW_STOCK").length, icon: PackageX, color: "text-warning", bg: "bg-warning/10" },
          { label: "Pending", count: alertsData.filter((a) => a.status === "PENDING").length, icon: Clock, color: "text-info", bg: "bg-info/10" },
        ].map((s) => (
          <div key={s.label} className="metric-card flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.bg}`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <div>
              <div className="text-xl font-bold text-foreground">{s.count}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b">
        <button onClick={() => setTab("active")} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === "active" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
          Active Alerts ({alertsData.length})
        </button>
        <button onClick={() => setTab("rules")} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === "rules" ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
          Alert Rules ({rulesData.length})
        </button>
      </div>

      {tab === "active" ? (
        <div className="space-y-3">
          {alertsError && (
            <div className="flex justify-center gap-2 py-4">
              <p className="text-destructive text-sm">Failed to load alerts</p>
              <Button variant="outline" size="sm" onClick={() => refetchAlerts()}><RefreshCw className="h-4 w-4 mr-1" />Retry</Button>
            </div>
          )}
          {alertsData.map((alert: Alert) => (
            <div key={alert.id} className={`rounded-lg border p-4 transition-colors ${alert.status !== "PENDING" ? "opacity-60" : "bg-card"}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {severityIcon[alert.severity] ?? <Bell className="h-4 w-4" />}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase ${severityStyle[alert.severity] ?? ""}`}>
                        {alert.severity}
                      </span>
                      <span className="text-sm font-medium text-foreground">{alert.title}</span>
                      <span className="text-xs text-muted-foreground">· {new Date(alert.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-foreground">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{alert.sourceService} — {alert.sourceId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {alert.status === "PENDING" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => acknowledge.mutate({ id: alert.id, acknowledgedBy: userName })}
                      disabled={acknowledge.isPending}
                    >
                      <Check className="h-3.5 w-3.5 mr-1" /> Ack
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {alertsData.length === 0 && !alertsError && (
            <div className="text-center text-muted-foreground py-12">No alerts — everything looks good! 🎉</div>
          )}
        </div>
      ) : (
        <div className="bg-card rounded-lg border shadow-card overflow-x-auto">
          {rulesError && (
            <div className="flex justify-center gap-2 py-4">
              <p className="text-destructive text-sm">Failed to load rules</p>
              <Button variant="outline" size="sm" onClick={() => refetchRules()}><RefreshCw className="h-4 w-4 mr-1" />Retry</Button>
            </div>
          )}
          <table className="data-table">
            <thead>
              <tr><th>Rule Name</th><th>Condition</th><th>Severity</th><th>Targets</th><th>Action</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {rulesData.map((rule: AlertRule) => (
                <tr key={rule.id}>
                  <td className="font-medium">{rule.name}</td>
                  <td className="text-sm text-muted-foreground">{rule.condition}</td>
                  <td><span className={`status-badge ${severityStyle[rule.severity] ?? ""}`}>{rule.severity}</span></td>
                  <td className="text-sm text-muted-foreground">{rule.targets}</td>
                  <td className="text-sm text-muted-foreground">{rule.action}</td>
                  <td>
                    <span className={`status-badge ${rule.enabled ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}`}>
                      {rule.enabled ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => toggleRule.mutate(rule.id)}>
                          <Settings className="h-4 w-4 mr-2" /> {rule.enabled ? "Disable" : "Enable"} Rule
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive"><X className="h-4 w-4 mr-2" /> Delete Rule</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {rulesData.length === 0 && !rulesError && (
                <tr><td colSpan={7} className="text-center text-muted-foreground py-12">No alert rules defined yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Rule Dialog */}
      <Dialog open={addRuleOpen} onOpenChange={setAddRuleOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader><DialogTitle>Create Alert Rule</DialogTitle></DialogHeader>
          <form onSubmit={handleCreateRule} className="space-y-4">
            <div className="space-y-2"><Label>Rule Name</Label><Input placeholder="Low Stock Alert" value={ruleForm.name} onChange={(e) => setRuleForm({ ...ruleForm, name: e.target.value })} required /></div>
            <div className="space-y-2"><Label>Condition</Label><Input placeholder="Quantity < Reorder Point" value={ruleForm.condition} onChange={(e) => setRuleForm({ ...ruleForm, condition: e.target.value })} required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Severity</Label>
                <Select value={ruleForm.severity} onValueChange={(v) => setRuleForm({ ...ruleForm, severity: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Info / Low</SelectItem>
                    <SelectItem value="WARNING">Warning</SelectItem>
                    <SelectItem value="CRITICAL">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notification Channel</Label>
                <Select value={ruleForm.action} onValueChange={(v) => setRuleForm({ ...ruleForm, action: v })}>
                  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dashboard">Dashboard Only</SelectItem>
                    <SelectItem value="Email + Dashboard">Email + Dashboard</SelectItem>
                    <SelectItem value="SMS + Email">SMS + Email</SelectItem>
                    <SelectItem value="Email + Dashboard + Slack">All Channels</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddRuleOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createRule.isPending}>
                {createRule.isPending ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : null}
                Create Rule
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AlertsPage;
