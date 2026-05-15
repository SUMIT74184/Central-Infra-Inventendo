import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useUpdateWarehouse, type Warehouse } from "@/hooks/useWarehouses";

interface EditWarehouseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warehouse: Warehouse | null;
}

const EditWarehouseDialog: React.FC<EditWarehouseDialogProps> = ({ open, onOpenChange, warehouse }) => {
  const updateWarehouse = useUpdateWarehouse();

  const [form, setForm] = useState({
    name: "",
    location: "",
    type: "distribution",
    capacity: "",
    managerName: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (warehouse && open) {
      setForm({
        name: warehouse.name || "",
        location: warehouse.location || warehouse.city || "",
        type: warehouse.type || "distribution",
        capacity: warehouse.capacity?.toString() || "",
        managerName: warehouse.managerName || "",
        status: warehouse.status || (warehouse.active !== false ? "ACTIVE" : "INACTIVE"),
      });
    }
  }, [warehouse, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!warehouse) return;

    try {
      await updateWarehouse.mutateAsync({
        id: warehouse.id,
        payload: {
          name: form.name,
          location: form.location,
          type: form.type,
          capacity: Number(form.capacity),
          managerName: form.managerName,
          status: form.status,
        }
      });
      toast.success("Warehouse updated successfully");
      onOpenChange(false);
    } catch {
      toast.error("Failed to update warehouse");
    }
  };

  if (!warehouse) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Warehouse: {warehouse.name}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-wh-name">Warehouse Name *</Label>
            <Input id="edit-wh-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-wh-location">Location / City *</Label>
              <Input id="edit-wh-location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-wh-type">Type *</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })} required>
                <SelectTrigger id="edit-wh-type"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="distribution">Distribution</SelectItem>
                  <SelectItem value="fulfillment">Fulfillment</SelectItem>
                  <SelectItem value="cold-storage">Cold Storage</SelectItem>
                  <SelectItem value="cross-dock">Cross Dock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-wh-capacity">Total Capacity *</Label>
              <Input id="edit-wh-capacity" type="number" min="0" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-wh-status">Status *</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })} required>
                <SelectTrigger id="edit-wh-status"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-wh-manager">Manager Name</Label>
            <Input id="edit-wh-manager" value={form.managerName} onChange={(e) => setForm({ ...form, managerName: e.target.value })} placeholder="e.g. Jane Doe" />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={updateWarehouse.isPending}>
              {updateWarehouse.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditWarehouseDialog;
