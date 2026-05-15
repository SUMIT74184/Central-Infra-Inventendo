import React from "react";
import { Building2, Search, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const tenants = [
  { id: "tnt_001", name: "GlobalTech Corp", plan: "Enterprise", users: 2450, skus: 890000, status: "Active", created: "Jan 2024", mrr: "$12,400" },
  { id: "tnt_002", name: "RetailMax Inc", plan: "Enterprise", users: 1800, skus: 650000, status: "Active", created: "Mar 2024", mrr: "$8,900" },
  { id: "tnt_003", name: "FreshSupply Co", plan: "Business", users: 920, skus: 420000, status: "Active", created: "Jun 2024", mrr: "$5,200" },
  { id: "tnt_004", name: "AutoParts Hub", plan: "Business", users: 560, skus: 380000, status: "Active", created: "Aug 2024", mrr: "$3,800" },
  { id: "tnt_005", name: "MedEquip Direct", plan: "Pro", users: 340, skus: 180000, status: "Active", created: "Oct 2024", mrr: "$2,400" },
  { id: "tnt_006", name: "QuickBite Supplies", plan: "Starter", users: 45, skus: 12000, status: "Trial", created: "Mar 2026", mrr: "$0" },
  { id: "tnt_007", name: "OldStock LLC", plan: "Pro", users: 120, skus: 65000, status: "Suspended", created: "Apr 2025", mrr: "$0" },
];

const statusStyle: Record<string, string> = {
  Active: "bg-success/10 text-success",
  Trial: "bg-info/10 text-info",
  Suspended: "bg-destructive/10 text-destructive",
};

const AdminTenantsPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Building2 className="h-6 w-6" /> Tenants Management
          </h1>
          <p className="text-sm text-muted-foreground">{tenants.length} registered tenants</p>
        </div>
        <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Tenant</Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search tenants..." className="pl-9 bg-card" />
      </div>

      <div className="bg-card rounded-lg border shadow-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tenant Name</th>
              <th>Plan</th>
              <th>Users</th>
              <th>SKUs</th>
              <th>MRR</th>
              <th>Status</th>
              <th>Created</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((t) => (
              <tr key={t.id}>
                <td className="font-mono text-xs">{t.id}</td>
                <td className="font-medium">{t.name}</td>
                <td><span className="status-badge bg-primary/10 text-primary">{t.plan}</span></td>
                <td>{t.users.toLocaleString()}</td>
                <td>{t.skus.toLocaleString()}</td>
                <td className="font-medium">{t.mrr}</td>
                <td><span className={`status-badge ${statusStyle[t.status]}`}>{t.status}</span></td>
                <td className="text-muted-foreground">{t.created}</td>
                <td>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTenantsPage;
