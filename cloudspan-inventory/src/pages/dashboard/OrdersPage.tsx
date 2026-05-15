import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingCart, Plus, Search, Download, MoreHorizontal, Eye, Edit, Trash2, RefreshCw, Loader2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AddOrderDialog from "@/components/dialogs/AddOrderDialog";
import ExportDialog from "@/components/dialogs/ExportDialog";
import DeleteConfirmDialog from "@/components/dialogs/DeleteConfirmDialog";
import FilterDropdown from "@/components/dialogs/FilterDropdown";
import ViewOrderDialog from "@/components/dialogs/ViewOrderDialog";
import { toast } from "sonner";
import { useOrders, useUpdateOrderStatus, useCancelOrder, type Order } from "@/hooks/useOrders";

const statusStyle: Record<string, string> = {
  PENDING: "bg-warning/10 text-warning",
  PROCESSING: "bg-info/10 text-info",
  SHIPPED: "bg-primary/10 text-primary",
  DELIVERED: "bg-success/10 text-success",
  CANCELLED: "bg-destructive/10 text-destructive",
};

const statusOptions = [
  { label: "Pending", value: "PENDING" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const OrdersPage: React.FC = () => {
  const { data: ordersData = [], isLoading, isError, refetch } = useOrders();
  const updateStatus = useUpdateOrderStatus();
  const cancelOrder = useCancelOrder();

  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState({ name: "", id: 0 });
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  const filtered = ordersData.filter((o) => {
    const matchSearch = o.orderNumber.toLowerCase().includes(search.toLowerCase()) || o.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter.length === 0 || statusFilter.includes(o.status);
    return matchSearch && matchStatus;
  });

  const handleCancel = async (order: Order) => {
    try {
      await cancelOrder.mutateAsync(order.id);
      toast.success(`Order ${order.orderNumber} cancelled`);
      setDeleteOpen(false);
    } catch {
      toast.error("Failed to cancel order");
    }
  };

  const handleUpdateStatus = async (id: number, status: string, orderNumber: string) => {
    try {
      await updateStatus.mutateAsync({ id, status });
      toast.success(`Order ${orderNumber} marked as ${status}`);
    } catch {
      toast.error(`Failed to update status for ${orderNumber}`);
    }
  };

  if (isLoading) return (
    <div className="p-6 flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  if (isError) return (
    <div className="p-6 flex flex-col items-center justify-center h-64 gap-3">
      <p className="text-destructive font-medium">Failed to load orders</p>
      <Button variant="outline" size="sm" onClick={() => refetch()}><RefreshCw className="h-4 w-4 mr-1" />Retry</Button>
    </div>
  );

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" /> Orders
          </h1>
          <p className="text-sm text-muted-foreground">{ordersData.length} total orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setExportOpen(true)}>
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> New Order
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-card" />
        </div>
        <FilterDropdown label="Status" options={statusOptions} selected={statusFilter} onToggle={(v) => setStatusFilter((p) => p.includes(v) ? p.filter((s) => s !== v) : [...p, v])} />
      </div>

      <div className="bg-card rounded-lg border shadow-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Order #</th><th>Customer</th><th>Items</th><th>Priority</th><th>Warehouse</th><th>Status</th><th>Total</th><th>Date</th><th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order: Order) => (
              <tr key={order.id}>
                <td className="font-mono text-xs">{order.orderNumber}</td>
                <td className="font-medium">{order.customerName}</td>
                <td>{order.itemCount ?? order.items?.length ?? 0}</td>
                <td>
                  <span className={`status-badge text-xs ${
                    order.priority === "URGENT" ? "bg-destructive/10 text-destructive" :
                    order.priority === "HIGH" ? "bg-warning/10 text-warning" :
                    "bg-muted text-muted-foreground"
                  }`}>{order.priority ?? "NORMAL"}</span>
                </td>
                <td className="text-muted-foreground">{order.warehouseId ?? "—"}</td>
                <td><span className={`status-badge ${statusStyle[order.status] ?? "bg-muted text-muted-foreground"}`}>{order.status}</span></td>
                <td className="font-medium">${Number(order.totalAmount).toFixed(2)}</td>
                <td className="text-muted-foreground whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { setViewOrder(order); setViewOpen(true); }}><Eye className="h-4 w-4 mr-2" /> View Details</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "PROCESSING", order.orderNumber)} disabled={updateStatus.isPending}><Edit className="h-4 w-4 mr-2" /> Mark Processing</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, "SHIPPED", order.orderNumber)} disabled={updateStatus.isPending}><RefreshCw className="h-4 w-4 mr-2" /> Mark Shipped</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => { setDeleteItem({ name: order.customerName, id: order.id }); setDeleteOpen(true); }}>
                        <Trash2 className="h-4 w-4 mr-2" /> Cancel Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="text-center text-muted-foreground py-12">No orders found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AddOrderDialog open={addOpen} onOpenChange={setAddOpen} />
      <ViewOrderDialog open={viewOpen} onOpenChange={setViewOpen} order={viewOrder} />
      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} title="Orders" data={filtered as unknown as Record<string, unknown>[]} />
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        itemName={deleteItem.name}
        itemType="Order"
        onConfirm={() => handleCancel(ordersData.find(o => o.id === deleteItem.id)!)}
      />
    </div>
  );
};

export default OrdersPage;
