import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type Order } from "@/hooks/useOrders";

interface ViewOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: Order | null;
}

const ViewOrderDialog: React.FC<ViewOrderDialogProps> = ({ open, onOpenChange, order }) => {
  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Order Details: {order.orderNumber}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm bg-muted/30 p-4 rounded-lg">
            <div>
              <span className="text-muted-foreground block text-xs">Customer</span>
              <span className="font-medium">{order.customerName}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs">Status</span>
              <span className="font-medium">{order.status}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs">Priority</span>
              <span>{order.priority || "NORMAL"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs">Date</span>
              <span>{new Date(order.createdAt).toLocaleString()}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Shipping Address</h4>
              <p className="bg-muted/30 p-3 rounded">{order.shippingAddress || "Not provided"}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Billing Address</h4>
              <p className="bg-muted/30 p-3 rounded">{order.billingAddress || order.shippingAddress || "Not provided"}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Order Items</h4>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="p-2">Item</th>
                    <th className="p-2 text-right">Qty</th>
                    <th className="p-2 text-right">Price</th>
                    <th className="p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {order.items?.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2">
                        <div className="font-medium">{item.productName}</div>
                        <div className="text-xs text-muted-foreground font-mono">{item.sku}</div>
                      </td>
                      <td className="p-2 text-right">{item.quantity}</td>
                      <td className="p-2 text-right">${Number(item.unitPrice).toFixed(2)}</td>
                      <td className="p-2 text-right font-medium">${Number(item.totalPrice).toFixed(2)}</td>
                    </tr>
                  ))}
                  {!order.items?.length && (
                    <tr>
                      <td colSpan={4} className="p-4 text-center text-muted-foreground">No items found</td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="bg-muted/20">
                  <tr>
                    <td colSpan={3} className="p-2 text-right font-semibold">Total Amount:</td>
                    <td className="p-2 text-right font-bold text-primary">${Number(order.totalAmount).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          {order.notes && (
            <div>
              <h4 className="font-semibold mb-2">Notes</h4>
              <p className="bg-muted/30 p-3 rounded text-sm">{order.notes}</p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewOrderDialog;
