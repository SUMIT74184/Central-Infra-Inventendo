import React, { useState } from "react";
import { Warehouse as WarehouseIcon, MapPin, Package, Users, MoreHorizontal, Plus, Edit, Trash2, Eye, Settings, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AddWarehouseDialog from "@/components/dialogs/AddWarehouseDialog";
import DeleteConfirmDialog from "@/components/dialogs/DeleteConfirmDialog";
import ViewWarehouseDialog from "@/components/dialogs/ViewWarehouseDialog";
import EditWarehouseDialog from "@/components/dialogs/EditWarehouseDialog";
import ManageZonesDialog from "@/components/dialogs/ManageZonesDialog";
import { toast } from "sonner";
import { useWarehouses, useDeleteWarehouse, type Warehouse } from "@/hooks/useWarehouses";

const statusStyle: Record<string, string> = {
  ACTIVE: "bg-success/10 text-success",
  INACTIVE: "bg-muted text-muted-foreground",
  MAINTENANCE: "bg-info/10 text-info",
  NEAR_CAPACITY: "bg-warning/10 text-warning",
};

const getCapacityStatus = (utilization: number) => {
  if (utilization >= 90) return "NEAR_CAPACITY";
  if (utilization < 0) return "INACTIVE";
  return "ACTIVE";
};

const WarehousesPage: React.FC = () => {
  const { data: warehouses = [], isLoading, isError, refetch } = useWarehouses();

  const [addOpen, setAddOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState({ name: "", id: "" });
  
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [zonesOpen, setZonesOpen] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);

  const deleteWarehouse = useDeleteWarehouse();

  const handleDecommission = async () => {
    try {
      await deleteWarehouse.mutateAsync(Number(deleteItem.id));
      toast.success(`Warehouse "${deleteItem.name}" decommissioned`);
      setDeleteOpen(false);
    } catch {
      toast.error("Failed to decommission warehouse");
    }
  };

  if (isLoading) return (
    <div className="p-6 flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  if (isError) return (
    <div className="p-6 flex flex-col items-center justify-center h-64 gap-3">
      <p className="text-destructive font-medium">Failed to load warehouses</p>
      <Button variant="outline" size="sm" onClick={() => refetch()}><RefreshCw className="h-4 w-4 mr-1" />Retry</Button>
    </div>
  );

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <WarehouseIcon className="h-6 w-6" /> Warehouses
          </h1>
          <p className="text-sm text-muted-foreground">{warehouses.length} active locations</p>
        </div>
        <Button size="sm" onClick={() => setAddOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> Add Warehouse
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {warehouses.map((wh: Warehouse) => {
          const utilPct = wh.capacity > 0 ? Math.round((wh.currentUtilization / wh.capacity) * 100) : 0;
          const statusKey = wh.status ?? getCapacityStatus(utilPct);
          return (
            <div key={wh.id} className="metric-card space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{wh.name}</h3>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-3 w-3" /> {wh.location || wh.city}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => { setSelectedWarehouse(wh); setViewOpen(true); }}><Eye className="h-4 w-4 mr-2" /> View Details</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setSelectedWarehouse(wh); setEditOpen(true); }}><Edit className="h-4 w-4 mr-2" /> Edit Warehouse</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setSelectedWarehouse(wh); setZonesOpen(true); }}><Settings className="h-4 w-4 mr-2" /> Manage Zones ({wh.zones ?? 0})</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive" onClick={() => { setDeleteItem({ name: wh.name, id: String(wh.id) }); setDeleteOpen(true); }}>
                      <Trash2 className="h-4 w-4 mr-2" /> Decommission
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center justify-between">
                <span className={`status-badge ${statusStyle[statusKey] ?? "bg-muted text-muted-foreground"}`}>{statusKey.replace("_", " ")}</span>
                <span className="text-xs font-mono text-muted-foreground">{wh.type ?? "—"}</span>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Capacity</span>
                  <span className="font-medium text-foreground">{utilPct}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary">
                  <div className={`h-2 rounded-full transition-all ${utilPct > 85 ? "bg-warning" : "bg-primary"}`} style={{ width: `${Math.min(utilPct, 100)}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-muted-foreground"><Package className="h-3.5 w-3.5" /> {Number(wh.currentUtilization).toLocaleString()} units</span>
                <span className="flex items-center gap-1 text-muted-foreground"><Users className="h-3.5 w-3.5" /> {wh.staffCount ?? 0} staff</span>
              </div>
            </div>
          );
        })}
      </div>

      {warehouses.length === 0 && (
        <div className="text-center text-muted-foreground py-20">No warehouses found. Add your first warehouse.</div>
      )}

      <AddWarehouseDialog open={addOpen} onOpenChange={setAddOpen} />
      <ViewWarehouseDialog open={viewOpen} onOpenChange={setViewOpen} warehouse={selectedWarehouse} />
      <EditWarehouseDialog open={editOpen} onOpenChange={setEditOpen} warehouse={selectedWarehouse} />
      <ManageZonesDialog open={zonesOpen} onOpenChange={setZonesOpen} warehouse={selectedWarehouse} />
      <DeleteConfirmDialog open={deleteOpen} onOpenChange={setDeleteOpen} itemName={deleteItem.name} itemType="Warehouse" onConfirm={handleDecommission} />
    </div>
  );
};

export default WarehousesPage;
