import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type Warehouse } from "@/hooks/useWarehouses";

interface ViewWarehouseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warehouse: Warehouse | null;
}

const ViewWarehouseDialog: React.FC<ViewWarehouseDialogProps> = ({ open, onOpenChange, warehouse }) => {
  if (!warehouse) return null;

  const utilPct = warehouse.capacity > 0 ? Math.round((warehouse.currentUtilization / warehouse.capacity) * 100) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Warehouse Details: {warehouse.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm bg-muted/20 p-4 rounded-lg">
            <div>
              <span className="text-muted-foreground block text-xs">Code / ID</span>
              <span className="font-mono">{warehouse.warehouseCode || warehouse.id}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs">Type</span>
              <span className="capitalize">{warehouse.type || "General"}</span>
            </div>
            <div>
              <span className="text-muted-foreground block text-xs">Status</span>
              <span className="font-medium">{warehouse.status || (warehouse.active !== false ? "ACTIVE" : "INACTIVE")}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-xs text-muted-foreground mb-1">Location Details</h4>
              <p>{warehouse.location}</p>
              <p>{warehouse.city}{warehouse.state ? `, ${warehouse.state}` : ""}</p>
              <p>{warehouse.country} {warehouse.zipCode}</p>
              <p className="mt-2 text-muted-foreground">{warehouse.address}</p>
            </div>
            <div>
              <h4 className="font-semibold text-xs text-muted-foreground mb-1">Contact Info</h4>
              <p>Manager: {warehouse.managerName || "Not assigned"}</p>
              <p>Email: {warehouse.email || "N/A"}</p>
              <p>Phone: {warehouse.contactNumber || "N/A"}</p>
              <p className="mt-2 text-muted-foreground">Staff Count: {warehouse.staffCount || 0}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-semibold text-sm mb-3">Capacity & Utilization</h4>
            <div className="grid grid-cols-3 gap-4 mb-2 text-center sm:text-left">
              <div>
                <span className="text-muted-foreground block text-xs">Capacity</span>
                <span className="font-medium text-lg">{warehouse.capacity.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">Current Load</span>
                <span className="font-medium text-lg text-primary">{warehouse.currentUtilization.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">Zones</span>
                <span className="font-medium text-lg">{warehouse.zones || 0}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Utilization Rate</span>
                <span>{utilPct}%</span>
              </div>
              <div className="h-2 rounded-full bg-secondary">
                <div 
                  className={`h-2 rounded-full transition-all ${utilPct > 90 ? "bg-destructive" : utilPct > 75 ? "bg-warning" : "bg-primary"}`} 
                  style={{ width: `${Math.min(utilPct, 100)}%` }} 
                />
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

export default ViewWarehouseDialog;
