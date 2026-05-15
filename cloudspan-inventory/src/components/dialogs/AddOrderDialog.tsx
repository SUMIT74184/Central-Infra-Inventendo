import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useCreateOrder } from "@/hooks/useOrders";
import { useWarehouses } from "@/hooks/useWarehouses";
import { useInventory } from "@/hooks/useInventory";

interface AddOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialForm = {
  customerName: "",
  customerEmail: "",
  customerId: "",
  productId: "",
  quantity: "1",
  warehouse: "",
  shippingAddress: "",
  billingAddress: "",
  priority: "NORMAL",
  notes: "",
};

const AddOrderDialog: React.FC<AddOrderDialogProps> = ({ open, onOpenChange }) => {
  const [form, setForm] = useState(initialForm);
  const createOrder = useCreateOrder();
  const { data: warehouses = [] } = useWarehouses();
  const { data: inventoryData } = useInventory(0, 100);
  const inventoryItems = inventoryData?.content || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedProduct = inventoryItems.find(i => String(i.id) === form.productId);
    try {
      await createOrder.mutateAsync({
        customerId: Number(form.customerId),
        customerName: form.customerName,
        customerEmail: form.customerEmail || undefined,
        items: [
          {
            productId: Number(form.productId),
            quantity: Number(form.quantity),
            unitPrice: selectedProduct?.unitPrice || 0,
          },
        ],
        shippingAddress: form.shippingAddress,
        billingAddress: form.billingAddress || undefined,
        warehouseId: form.warehouse || undefined,
        priority: form.priority,
        notes: form.notes || undefined,
      });
      toast.success(`Order for "${form.customerName}" created successfully`);
      setForm(initialForm);
      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create order");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Order</DialogTitle>
          <DialogDescription>Enter customer and product details to place an order.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Customer Name</Label>
              <Input placeholder="TechFlow Inc" value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Customer ID</Label>
              <Input type="number" placeholder="1001" value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Customer Email</Label>
            <Input type="email" placeholder="customer@example.com" value={form.customerEmail} onChange={(e) => setForm({ ...form, customerEmail: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input type="number" min="1" placeholder="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Warehouse</Label>
              <Select value={form.warehouse} onValueChange={(v) => setForm({ ...form, warehouse: v })}>
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
              <Label>Priority</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="NORMAL">Normal</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Shipping Address</Label>
            <Input placeholder="123 Main St, City, State" value={form.shippingAddress} onChange={(e) => setForm({ ...form, shippingAddress: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <Label>Notes</Label>
            <Input placeholder="Special handling instructions..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={createOrder.isPending}>
              {createOrder.isPending ? "Creating..." : "Create Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddOrderDialog;
