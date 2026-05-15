import React from "react";
import { Users, Search, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const users = [
  { id: "usr_001", name: "John Kim", email: "john@globaltech.com", tenant: "GlobalTech Corp", role: "Admin", lastActive: "2 min ago", status: "Online" },
  { id: "usr_002", name: "Sarah Chen", email: "sarah@retailmax.com", tenant: "RetailMax Inc", role: "Manager", lastActive: "10 min ago", status: "Online" },
  { id: "usr_003", name: "Mike Patel", email: "mike@freshsupply.co", tenant: "FreshSupply Co", role: "Operator", lastActive: "1 hr ago", status: "Offline" },
  { id: "usr_004", name: "Lisa Park", email: "lisa@autoparts.com", tenant: "AutoParts Hub", role: "Admin", lastActive: "3 hrs ago", status: "Offline" },
  { id: "usr_005", name: "Alex Singh", email: "alex@medequip.com", tenant: "MedEquip Direct", role: "Viewer", lastActive: "1 day ago", status: "Offline" },
];

const statusStyle: Record<string, string> = {
  Online: "bg-success/10 text-success",
  Offline: "bg-muted text-muted-foreground",
};

const AdminUsersPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Users className="h-6 w-6" /> User Management
        </h1>
        <p className="text-sm text-muted-foreground">All users across tenants</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search users..." className="pl-9 bg-card" />
      </div>

      <div className="bg-card rounded-lg border shadow-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Tenant</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="font-medium">{u.name}</td>
                <td className="text-muted-foreground">{u.email}</td>
                <td>{u.tenant}</td>
                <td><span className="status-badge bg-accent text-accent-foreground">{u.role}</span></td>
                <td><span className={`status-badge ${statusStyle[u.status]}`}>{u.status}</span></td>
                <td className="text-muted-foreground">{u.lastActive}</td>
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

export default AdminUsersPage;
