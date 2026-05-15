import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Package, Plus, Search, Download, MoreHorizontal, Edit, Trash2, Eye, Copy, Loader2, RefreshCw } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import AddInventoryDialog from "@/components/dialogs/AddInventoryDialog";
import ExportDialog from "@/components/dialogs/ExportDialog";
import DeleteConfirmDialog from "@/components/dialogs/DeleteConfirmDialog";
import FilterDropdown from "@/components/dialogs/FilterDropdown";
import EditInventoryDialog from "@/components/dialogs/EditInventoryDialog";
import ViewInventoryDialog from "@/components/dialogs/ViewInventoryDialog";
import { toast } from "sonner";
import { useInventory, useDeleteInventory, type InventoryItem } from "@/hooks/useInventory";

const statusStyle: Record<string, string> = {
  "NORMAL": "bg-success/10 text-success",
  "LOW_STOCK": "bg-warning/10 text-warning",
  "OUT_OF_STOCK": "bg-destructive/10 text-destructive",
  "OVERSTOCK": "bg-info/10 text-info",
};

const statusLabel: Record<string, string> = {
  "NORMAL": "In Stock",
  "LOW_STOCK": "Low Stock",
  "OUT_OF_STOCK": "Out of Stock",
  "OVERSTOCK": "Overstock",
};

const statusOptions = [
  { label: "In Stock", value: "NORMAL" },
  { label: "Low Stock", value: "LOW_STOCK" },
  { label: "Out of Stock", value: "OUT_OF_STOCK" },
];

const InventoryPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const size = 20;

  const { data: inventoryPage, isLoading, isError, refetch } = useInventory(page, size);
  const inventoryData = inventoryPage?.content || [];

  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState({ name: "", sku: "" });
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewItem, setViewItem] = useState<InventoryItem | null>(null);
  
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const deleteInventory = useDeleteInventory();

  const toggleFilter = (arr: string[], val: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  // Derive dynamic categories from API data
  const categoryOptions = [...new Set(inventoryData.map((i) => i.category).filter(Boolean))].map((c) => ({ label: c, value: c }));

  const filtered = inventoryData.filter((i) => {
    const matchSearch = i.productName.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter.length === 0 || categoryFilter.includes(i.category);
    const matchStatus = statusFilter.length === 0 || statusFilter.includes(i.status);
    return matchSearch && matchCategory && matchStatus;
  });

  const toggleSelect = (sku: string) => setSelected((prev) => prev.includes(sku) ? prev.filter((s) => s !== sku) : [...prev, sku]);
  const selectAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map((i) => i.sku));

  if (isLoading) return (
    <div className="p-6 flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  if (isError) return (
    <div className="p-6 flex flex-col items-center justify-center h-64 gap-3">
      <p className="text-destructive font-medium">Failed to load inventory</p>
      <Button variant="outline" size="sm" onClick={() => refetch()}><RefreshCw className="h-4 w-4 mr-1" />Retry</Button>
    </div>
  );

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Package className="h-6 w-6" /> Inventory
          </h1>
          <p className="text-sm text-muted-foreground">{inventoryData.length} items across all warehouses</p>
        </div>
        <div className="flex gap-2">
          {selected.length > 0 && (
            <Button variant="destructive" size="sm" onClick={() => { toast.success(`${selected.length} items deleted`); setSelected([]); }}>
              <Trash2 className="h-4 w-4 mr-1" /> Delete ({selected.length})
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => setExportOpen(true)}>
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Add Item
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or SKU..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-card" />
        </div>
        <FilterDropdown label="Category" options={categoryOptions} selected={categoryFilter} onToggle={(v) => toggleFilter(categoryFilter, v, setCategoryFilter)} />
        <FilterDropdown label="Status" options={statusOptions} selected={statusFilter} onToggle={(v) => toggleFilter(statusFilter, v, setStatusFilter)} />
      </div>

      <div className="bg-card rounded-lg border shadow-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th className="w-10"><input type="checkbox" checked={selected.length === filtered.length && filtered.length > 0} onChange={selectAll} className="h-4 w-4 rounded border-input accent-primary" /></th>
              <th>SKU</th><th>Product Name</th><th>Category</th><th>Warehouse</th><th>Qty</th><th>Reserved</th><th>Price</th><th>Status</th><th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item: InventoryItem) => (
              <tr key={item.sku} className={selected.includes(item.sku) ? "bg-primary/5" : ""}>
                <td><input type="checkbox" checked={selected.includes(item.sku)} onChange={() => toggleSelect(item.sku)} className="h-4 w-4 rounded border-input accent-primary" /></td>
                <td className="font-mono text-xs">{item.sku}</td>
                <td className="font-medium">{item.productName}</td>
                <td className="text-muted-foreground">{item.category || "—"}</td>
                <td className="text-muted-foreground">{item.warehouseName || item.warehouseId}</td>
                <td className="font-medium">{item.quantity.toLocaleString()}</td>
                <td className="text-muted-foreground">{item.reservedQuantity}</td>
                <td>${Number(item.unitPrice).toFixed(2)}</td>
                <td><span className={`status-badge ${statusStyle[item.status] ?? "bg-muted text-muted-foreground"}`}>{statusLabel[item.status] ?? item.status}</span></td>
                <td>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => { setViewItem(item); setViewOpen(true); }}><Eye className="h-4 w-4 mr-2" /> View Details</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setEditItem(item); setEditOpen(true); }}><Edit className="h-4 w-4 mr-2" /> Edit Item</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(item.sku); toast.success(`SKU ${item.sku} copied`); }}><Copy className="h-4 w-4 mr-2" /> Copy SKU</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => { setDeleteItem({ name: item.productName, sku: item.sku }); setDeleteOpen(true); }}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={10} className="text-center text-muted-foreground py-12">No inventory items found</td></tr>
            )}
          </tbody>
        </table>
        
        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t gap-4">
          <div className="text-sm text-muted-foreground text-center sm:text-left">
            Displaying {inventoryData.length > 0 ? ((inventoryPage?.number || 0) * size) + 1 : 0} to{" "}
            {Math.min(((inventoryPage?.number || 0) + 1) * size, inventoryPage?.totalElements || 0)} of{" "}
            {inventoryPage?.totalElements || 0} items
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled={!inventoryPage || page + 1 >= (inventoryPage?.totalPages || 1)} onClick={() => setPage(p => p + 1)}>
              Next
            </Button>
          </div>
        </div>
      </div>

      <AddInventoryDialog open={addOpen} onOpenChange={setAddOpen} />
      <EditInventoryDialog open={editOpen} onOpenChange={setEditOpen} item={editItem} />
      <ViewInventoryDialog open={viewOpen} onOpenChange={setViewOpen} item={viewItem} />
      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} title="Inventory" data={filtered as unknown as Record<string, unknown>[]} />
      <DeleteConfirmDialog 
        open={deleteOpen} 
        onOpenChange={setDeleteOpen} 
        itemName={deleteItem.name} 
        itemType="Item" 
        onConfirm={async () => {
          try {
            await deleteInventory.mutateAsync(deleteItem.sku);
            toast.success(`Item "${deleteItem.name}" deleted`);
            setSelected(selected.filter(s => s !== deleteItem.sku));
          } catch {
            toast.error("Failed to delete item");
          }
        }}
      />
    </div>
  );
};

export default InventoryPage;
