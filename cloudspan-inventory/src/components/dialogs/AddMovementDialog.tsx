import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useCreateMovement } from "@/hooks/useMovements";
import { useWarehouses } from "@/hooks/useWarehouses";
import { useInventory } from "@/hooks/useInventory";
import { v4 as uuidv4 } from "uuid";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialForm = {
  movementType: "",
  productId: "",
  warehouseId: "",
  quantity: "",
  unitPrice: "",
  fromLocation: "",
  toLocation: "",
  reason: "",
  referenceNumber: "",
  performedBy: "",
};

const AddMovementDialog: React.FC<Props> = ({ open, onOpenChange }) => {
  const [form, setForm] = useState(initialForm);
  const createMovement = useCreateMovement();
  const { data: warehouses = [] } = useWarehouses();
  const { data: inventoryData } = useInventory(0, 100);
  const inventoryItems = inventoryData?.content || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createMovement.mutateAsync({
        productId: Number(form.productId),
        warehouseId: Number(form.warehouseId),
        movementType: form.movementType,
        quantity: Number(form.quantity),
        unitPrice: form.unitPrice ? Number(form.unitPrice) : undefined,
        fromLocation: form.fromLocation,
        toLocation: form.toLocation,
        reason: form.reason || undefined,
        referenceNumber: form.referenceNumber || undefined,
        performedBy: form.performedBy || "system",
        idempotencyKey: uuidv4(),
      });
      toast.success("Stock movement recorded successfully");
      setForm(initialForm);
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to record movement");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Record Stock Movement</DialogTitle>
          <DialogDescription>Select a product and warehouse to record inventory movement.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Movement Type</Label>
              <Select value={form.movementType} onValueChange={(v) => setForm({ ...form, movementType: v })}>
                <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN">Inbound</SelectItem>
                  <SelectItem value="OUT">Outbound</SelectItem>
                  <SelectItem value="TRANSFER">Transfer</SelectItem>
                  <SelectItem value="RETURNED">Return</SelectItem>
                  <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
                  <SelectItem value="DAMAGED">Damaged</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Product</Label>
              <Select value={form.productId} onValueChange={(v) => setForm({ ...form, productId: v })}>
                <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent>
                  {inventoryItems.length > 0 ? (
                    inventoryItems.map((item) => (
                      <SelectItem key={item.id} value={String(item.id)}>
                        {item.sku} — {item.productName}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="__none" disabled>No products found</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input type="number" min="1" placeholder="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>From Location</Label>
              <Input placeholder="WH-East or Supplier" value={form.fromLocation} onChange={(e) => setForm({ ...form, fromLocation: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>To Location</Label>
              <Input placeholder="WH-West or Customer" value={form.toLocation} onChange={(e) => setForm({ ...form, toLocation: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Performed By</Label>
              <Input placeholder="Your name" value={form.performedBy} onChange={(e) => setForm({ ...form, performedBy: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Reason / Notes</Label>
              <Input placeholder="Restocking, transfer..." value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={createMovement.isPending}>
              {createMovement.isPending ? "Recording..." : "Record Movement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddMovementDialog;
