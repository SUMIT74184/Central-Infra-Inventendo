import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type InventoryItem } from "@/hooks/useInventory";

interface ViewInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
}

const ViewInventoryDialog: React.FC<ViewInventoryDialogProps> = ({ open, onOpenChange, item }) => {
  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Inventory Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground block text-xs">SKU</span>
              <span className="font-mono font-medium">{item.sku}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs">Product Name</span>
              <span className="font-medium">{item.productName}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs">Category</span>
              <span>{item.category || "—"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs">Status</span>
              <span>{item.status}</span>
            </div>
            <div className="col-span-2 border-t pt-4">
              <span className="text-muted-foreground block text-xs mb-1">Description</span>
              <p className="bg-muted/50 p-2 rounded text-sm min-h-[60px]">{item.description || "No description provided."}</p>
            </div>
            <div className="col-span-2 border-t pt-4 grid grid-cols-3 gap-4">
              <div>
                <span className="text-muted-foreground block text-xs">Quantity</span>
                <span className="font-medium text-lg">{item.quantity}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">Reserved</span>
                <span className="font-medium text-lg text-warning">{item.reservedQuantity}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">Available</span>
                <span className="font-medium text-lg text-success">{item.availableQuantity}</span>
              </div>
            </div>
            <div className="col-span-2 border-t pt-4 grid grid-cols-2 gap-4">
              <div>
                <span className="text-muted-foreground block text-xs">Warehouse</span>
                <span>{item.warehouseName || item.warehouseId}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">Location</span>
                <span>{item.location || "—"}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">Unit Price</span>
                <span className="font-medium">${Number(item.unitPrice).toFixed(2)}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">Reorder Level / Max</span>
                <span>{item.reorderLevel} / {item.maxStockLevel}</span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewInventoryDialog;
