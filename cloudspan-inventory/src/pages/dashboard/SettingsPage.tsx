import React from "react";
import { Settings, User, Bell, Lock, Globe, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Settings className="h-6 w-6" /> Settings
        </h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <div className="bg-card rounded-lg border shadow-card p-6 space-y-4">
        <h3 className="section-title flex items-center gap-2"><User className="h-5 w-5" /> Profile</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input defaultValue={user?.name} />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input defaultValue={user?.email} disabled />
          </div>
          <div className="space-y-2">
            <Label>Organization</Label>
            <Input defaultValue={user?.tenantName || "N/A"} />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Input defaultValue={user?.role} disabled />
          </div>
        </div>
        <Button size="sm">Save Changes</Button>
      </div>

      {/* Notifications */}
      <div className="bg-card rounded-lg border shadow-card p-6 space-y-4">
        <h3 className="section-title flex items-center gap-2"><Bell className="h-5 w-5" /> Notifications</h3>
        <div className="space-y-3">
          {["Low stock alerts", "Order status updates", "Warehouse reports", "Billing reminders"].map((item) => (
            <label key={item} className="flex items-center justify-between cursor-pointer py-1">
              <span className="text-sm text-foreground">{item}</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-input accent-primary" />
            </label>
          ))}
        </div>
      </div>

      {/* Security */}
      <div className="bg-card rounded-lg border shadow-card p-6 space-y-4">
        <h3 className="section-title flex items-center gap-2"><Lock className="h-5 w-5" /> Security</h3>
        <div className="space-y-3">
          <Button variant="outline" size="sm">Change Password</Button>
          <Button variant="outline" size="sm" className="ml-2">Enable 2FA</Button>
        </div>
      </div>

      {/* API & Integrations */}
      <div className="bg-card rounded-lg border shadow-card p-6 space-y-4">
        <h3 className="section-title flex items-center gap-2"><Globe className="h-5 w-5" /> API Access</h3>
        <div className="space-y-2">
          <Label>API Key</Label>
          <div className="flex gap-2">
            <Input value="inv_sk_••••••••••••••••••••" disabled className="font-mono" />
            <Button variant="outline" size="sm">Regenerate</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
