import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useUpdateInventory, type InventoryItem } from "@/hooks/useInventory";
import { useWarehouses } from "@/hooks/useWarehouses";

interface EditInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
}

const EditInventoryDialog: React.FC<EditInventoryDialogProps> = ({ open, onOpenChange, item }) => {
  const updateInventory = useUpdateInventory();
  const { data: warehouses = [] } = useWarehouses();

  const [form, setForm] = useState({
    productName: "",
    description: "",
    category: "",
    warehouseId: "",
    quantity: "",
    reorderLevel: "",
    maxStockLevel: "",
    unitPrice: "",
    location: "",
  });

  useEffect(() => {
    if (item && open) {
      setForm({
        productName: item.productName || "",
        description: item.description || "",
        category: item.category || "",
        warehouseId: item.warehouseId || "",
        quantity: item.quantity?.toString() || "",
        reorderLevel: item.reorderLevel?.toString() || "",
        maxStockLevel: item.maxStockLevel?.toString() || "",
        unitPrice: item.unitPrice?.toString() || "",
        location: item.location || "",
      });
    }
  }, [item, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    
    const selectedWarehouse = warehouses.find(w => String(w.id) === form.warehouseId);
    
    try {
      await updateInventory.mutateAsync({
        sku: item.sku,
        payload: {
          sku: item.sku,
          productName: form.productName,
          description: form.description,
          quantity: Number(form.quantity),
          reorderLevel: Number(form.reorderLevel),
          maxStockLevel: Number(form.maxStockLevel),
          unitPrice: Number(form.unitPrice),
          warehouseId: form.warehouseId,
          warehouseName: selectedWarehouse?.name || form.warehouseId,
          category: form.category,
          location: form.location,
        }
      });
      toast.success("Inventory item updated successfully");
      onOpenChange(false);
    } catch {
      toast.error("Failed to update inventory item");
    }
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Inventory Item: {item.sku}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-productName">Product Name *</Label>
              <Input id="edit-productName" value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Category *</Label>
              <Input id="edit-category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Input id="edit-description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-warehouse">Warehouse *</Label>
              <Select value={form.warehouseId} onValueChange={(v) => setForm({ ...form, warehouseId: v })} required>
                <SelectTrigger id="edit-warehouse"><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                <SelectContent>
                  {warehouses.map(w => (
                    <SelectItem key={w.id} value={String(w.id)}>{w.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location (Aisle/Bin)</Label>
              <Input id="edit-location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. A-12-B" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-quantity">Quantity *</Label>
              <Input id="edit-quantity" type="number" min="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-unitPrice">Unit Price ($) *</Label>
              <Input id="edit-unitPrice" type="number" min="0" step="0.01" value={form.unitPrice} onChange={(e) => setForm({ ...form, unitPrice: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-reorderLevel">Reorder Lvl</Label>
              <Input id="edit-reorderLevel" type="number" min="0" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-maxStockLevel">Max Stock</Label>
              <Input id="edit-maxStockLevel" type="number" min="0" value={form.maxStockLevel} onChange={(e) => setForm({ ...form, maxStockLevel: e.target.value })} required />
            </div>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={updateInventory.isPending}>
              {updateInventory.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditInventoryDialog;
