import React, { useState } from "react";
import { CreditCard, Check, TrendingUp, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import ExportDialog from "@/components/dialogs/ExportDialog";
import { toast } from "sonner";

const availablePlans = [
  {
    id: "free",
    name: "Free Tier",
    price: "$0",
    period: "/month",
    features: ["Up to 100 SKUs", "1 warehouse", "Basic support", "Community access"],
  },
  {
    id: "business",
    name: "Business",
    price: "$299",
    period: "/month",
    features: ["Unlimited SKUs", "Up to 10 warehouses", "API access", "Priority support", "Advanced analytics", "Custom integrations"],
  }
];

const currentPlan = availablePlans[1];

const invoices = [
  { id: "INV-2026-003", date: "Mar 1, 2026", amount: "$299.00", status: "Paid" },
  { id: "INV-2026-002", date: "Feb 1, 2026", amount: "$299.00", status: "Paid" },
  { id: "INV-2026-001", date: "Jan 1, 2026", amount: "$299.00", status: "Paid" },
  { id: "INV-2025-012", date: "Dec 1, 2025", amount: "$249.00", status: "Paid" },
];

const usageMetrics = [
  { label: "API Calls", used: 847000, limit: 1000000, unit: "calls" },
  { label: "Storage", used: 42, limit: 100, unit: "GB" },
  { label: "Warehouses", used: 6, limit: 10, unit: "" },
  { label: "Team Members", used: 12, limit: 25, unit: "" },
];

const BillingPage: React.FC = () => {
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <CreditCard className="h-6 w-6" /> Billing & Payments
          </h1>
          <p className="text-sm text-muted-foreground">Manage your subscription and billing details</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setExportOpen(true)}>
            <Download className="h-4 w-4 mr-1" /> Export Invoices
          </Button>
          <Button size="sm" onClick={() => toast.info("Payment method management coming soon")}>
            <CreditCard className="h-4 w-4 mr-1" /> Update Payment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="metric-card border-primary/30 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="section-title">Current Plan</h3>
            <span className="status-badge bg-primary/10 text-primary font-semibold">{currentPlan.name}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-foreground">{currentPlan.price}</span>
            <span className="text-muted-foreground">{currentPlan.period}</span>
          </div>
          <ul className="space-y-2">
            {currentPlan.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="h-4 w-4 text-success shrink-0" /> {f}
              </li>
            ))}
          </ul>
          <Button variant="outline" className="w-full" onClick={() => toast.info("Plan upgrade flow coming soon")}>Change Plan</Button>
        </div>

        <div className="lg:col-span-2 metric-card space-y-4">
          <h3 className="section-title flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-muted-foreground" /> Usage This Month
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {usageMetrics.map((u) => (
              <div key={u.label} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{u.label}</span>
                  <span className="font-medium text-foreground">{u.used.toLocaleString()} / {u.limit.toLocaleString()} {u.unit}</span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div className={`h-2 rounded-full ${(u.used / u.limit) > 0.8 ? "bg-warning" : "bg-primary"}`} style={{ width: `${Math.min((u.used / u.limit) * 100, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-card p-6 mb-6">
        <h3 className="section-title mb-4">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availablePlans.map((plan) => (
            <div key={plan.id} className={`border rounded-lg p-4 ${plan.id === currentPlan.id ? 'border-primary bg-primary/5' : 'border-border'}`}>
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold">{plan.name}</h4>
                {plan.id === currentPlan.id && <span className="status-badge bg-primary/10 text-primary text-xs">Current</span>}
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground text-sm">{plan.period}</span>
              </div>
              <ul className="space-y-2 mb-4">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="h-3 w-3 text-success shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              {plan.id !== currentPlan.id && (
                <Button variant="outline" size="sm" className="w-full" onClick={() => toast.success(`Switched to ${plan.name}`)}>
                  Select {plan.name}
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-lg border shadow-card">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="section-title flex items-center gap-2">
            <FileText className="h-5 w-5 text-muted-foreground" /> Invoice History
          </h3>
        </div>
        <table className="data-table">
          <thead>
            <tr><th>Invoice</th><th>Date</th><th>Amount</th><th>Status</th><th></th></tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id}>
                <td className="font-mono text-xs">{inv.id}</td>
                <td className="text-muted-foreground">{inv.date}</td>
                <td className="font-medium">{inv.amount}</td>
                <td><span className="status-badge bg-success/10 text-success">{inv.status}</span></td>
                <td><Button variant="ghost" size="sm" onClick={() => toast.success(`Downloading ${inv.id}.pdf`)}><Download className="h-4 w-4 mr-1" /> PDF</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} title="Invoices" />
    </div>
  );
};

export default BillingPage;
