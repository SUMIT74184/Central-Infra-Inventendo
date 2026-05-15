import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useCreateInventory } from "@/hooks/useInventory";
import { useWarehouses } from "@/hooks/useWarehouses";

interface AddInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialForm = {
  sku: "",
  productName: "",
  description: "",
  category: "",
  warehouseId: "",
  warehouseName: "",
  quantity: "",
  reorderLevel: "10",
  maxStockLevel: "1000",
  unitPrice: "",
  location: "",
};

const AddInventoryDialog: React.FC<AddInventoryDialogProps> = ({ open, onOpenChange }) => {
  const [form, setForm] = useState(initialForm);
  const createInventory = useCreateInventory();
  const { data: warehouses = [] } = useWarehouses();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Resolve warehouse name from selected id
    const selectedWarehouse = warehouses.find(w => String(w.id) === form.warehouseId);
    try {
      await createInventory.mutateAsync({
        sku: form.sku,
        productName: form.productName,
        description: form.description,
        quantity: Number(form.quantity),
        reorderLevel: Number(form.reorderLevel),
        maxStockLevel: Number(form.maxStockLevel),
        unitPrice: Number(form.unitPrice),
        warehouseId: form.warehouseId,
        warehouseName: selectedWarehouse?.name || form.warehouseId,
        category: form.category,
        location: form.location || undefined,
      });
      toast.success(`Item "${form.productName}" added successfully`);
      setForm(initialForm);
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create inventory item");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add Inventory Item</DialogTitle>
          <DialogDescription>Enter the product details and assign it to a warehouse.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>SKU</Label>
              <Input placeholder="ELC-0042" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input placeholder="USB-C Cable 2m" value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input placeholder="Product description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Peripherals">Peripherals</SelectItem>
                  <SelectItem value="Accessories">Accessories</SelectItem>
                  <SelectItem value="Components">Components</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Warehouse</Label>
              <Select value={form.warehouseId} onValueChange={(v) => setForm({ ...form, warehouseId: v })}>
                <SelectTrigger><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                <SelectContent>
                  {warehouses.length > 0 ? (
                    warehouses.map((wh) => (
                      <SelectItem key={wh.id} value={String(wh.id)}>
                        {wh.warehouseCode} — {wh.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="__none" disabled>No warehouses found</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input type="number" placeholder="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Unit Price ($)</Label>
              <Input type="number" step="0.01" placeholder="0.00" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Location</Label>
              <Input placeholder="Aisle B-3" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={createInventory.isPending}>
              {createInventory.isPending ? "Adding..." : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddInventoryDialog;
