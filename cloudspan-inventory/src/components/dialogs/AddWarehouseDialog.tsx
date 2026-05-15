import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useCreateWarehouse } from "@/hooks/useWarehouses";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialForm = {
  warehouseCode: "",
  name: "",
  location: "",
  address: "",
  city: "",
  state: "",
  country: "",
  zipCode: "",
  managerName: "",
  contactNumber: "",
  email: "",
  capacity: "",
  currentUtilization: "0",
  status: "ACTIVE",
};

const AddWarehouseDialog: React.FC<Props> = ({ open, onOpenChange }) => {
  const [form, setForm] = useState(initialForm);
  const createWarehouse = useCreateWarehouse();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createWarehouse.mutateAsync({
        warehouseCode: form.warehouseCode,
        name: form.name,
        location: form.location,
        address: form.address,
        city: form.city,
        state: form.state,
        country: form.country,
        zipCode: form.zipCode,
        managerName: form.managerName,
        contactNumber: form.contactNumber,
        email: form.email,
        capacity: Number(form.capacity),
        currentUtilization: Number(form.currentUtilization),
        status: form.status,
      } as any);
      toast.success(`Warehouse "${form.name}" created successfully`);
      setForm(initialForm);
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create warehouse");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add Warehouse</DialogTitle>
          <DialogDescription>Fill in the details to register a new warehouse.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Warehouse Code</Label>
              <Input placeholder="WH-EAST-01" value={form.warehouseCode} onChange={(e) => setForm({ ...form, warehouseCode: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Warehouse Name</Label>
              <Input placeholder="East Distribution Center" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Location</Label>
              <Input placeholder="New York, NY" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input placeholder="123 Warehouse Blvd" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>City</Label>
              <Input placeholder="New York" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>State</Label>
              <Input placeholder="NY" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Input placeholder="US" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Manager Name</Label>
              <Input placeholder="John Smith" value={form.managerName} onChange={(e) => setForm({ ...form, managerName: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" placeholder="manager@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Capacity</Label>
              <Input type="number" placeholder="50000" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Contact</Label>
              <Input placeholder="+1-555-1234" value={form.contactNumber} onChange={(e) => setForm({ ...form, contactNumber: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={createWarehouse.isPending}>
              {createWarehouse.isPending ? "Creating..." : "Create Warehouse"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWarehouseDialog;
