import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { type Warehouse } from "@/hooks/useWarehouses";

interface ManageZonesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  warehouse: Warehouse | null;
}

const ManageZonesDialog: React.FC<ManageZonesDialogProps> = ({ open, onOpenChange, warehouse }) => {
  if (!warehouse) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Manage Zones: {warehouse.name}</DialogTitle>
          <DialogDescription>Zone configuration for this facility.</DialogDescription>
        </DialogHeader>
        <div className="py-8 flex flex-col items-center justify-center space-y-3">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-2">
            <span className="text-2xl font-bold text-muted-foreground">{warehouse.zones || 0}</span>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Zone management functionality is currently being implemented by the backend team. 
            You will soon be able to add, edit, and configure storage zones directly from this panel.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManageZonesDialog;
