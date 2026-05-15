import React, { useState } from "react";
import { ArrowLeftRight, ArrowUp, ArrowDown, RotateCcw, Search, Plus, Download, Loader2, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AddMovementDialog from "@/components/dialogs/AddMovementDialog";
import ExportDialog from "@/components/dialogs/ExportDialog";
import FilterDropdown from "@/components/dialogs/FilterDropdown";
import { useMovements, enrichMovementsWithProductInfo, type StockMovement } from "@/hooks/useMovements";
import { useInventory } from "@/hooks/useInventory";

const typeIcon: Record<string, React.ReactNode> = {
  IN:        <ArrowDown className="h-4 w-4 text-success" />,
  OUT:       <ArrowUp className="h-4 w-4 text-destructive" />,
  TRANSFER:  <ArrowLeftRight className="h-4 w-4 text-info" />,
  RETURNED:  <RotateCcw className="h-4 w-4 text-warning" />,
  INBOUND:   <ArrowDown className="h-4 w-4 text-success" />,
  OUTBOUND:  <ArrowUp className="h-4 w-4 text-destructive" />,
};

const typeStyle: Record<string, string> = {
  IN:        "bg-success/10 text-success",
  OUT:       "bg-destructive/10 text-destructive",
  TRANSFER:  "bg-info/10 text-info",
  RETURNED:  "bg-warning/10 text-warning",
  INBOUND:   "bg-success/10 text-success",
  OUTBOUND:  "bg-destructive/10 text-destructive",
};

const typeOptions = [
  { label: "Inbound / IN", value: "IN" },
  { label: "Outbound / OUT", value: "OUT" },
  { label: "Transfer", value: "TRANSFER" },
  { label: "Return", value: "RETURNED" },
];

const MovementsPage: React.FC = () => {
  const { data: rawMovements = [], isLoading, isError, refetch } = useMovements();
  const { data: inventoryData } = useInventory();
  const inventoryItems = inventoryData?.content ?? [];

  const movements = enrichMovementsWithProductInfo(rawMovements, inventoryItems);

  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string[]>([]);

  const filtered = movements.filter((m) => {
    const matchSearch = (m.productName ?? "").toLowerCase().includes(search.toLowerCase()) ||
                        (m.sku ?? "").toLowerCase().includes(search.toLowerCase()) ||
                        String(m.id).includes(search);
    const matchType = typeFilter.length === 0 || typeFilter.includes(m.movementType);
    return matchSearch && matchType;
  });

  if (isLoading) return (
    <div className="p-6 flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );

  if (isError) return (
    <div className="p-6 flex flex-col items-center justify-center h-64 gap-3">
      <p className="text-destructive font-medium">Failed to load movements</p>
      <Button variant="outline" size="sm" onClick={() => refetch()}><RefreshCw className="h-4 w-4 mr-1" />Retry</Button>
    </div>
  );

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ArrowLeftRight className="h-6 w-6" /> Stock Movements
          </h1>
          <p className="text-sm text-muted-foreground">Track all inventory movements across warehouses</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setExportOpen(true)}>
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Record Movement
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search movements..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-card" />
        </div>
        <FilterDropdown label="Type" options={typeOptions} selected={typeFilter} onToggle={(v) => setTypeFilter((p) => p.includes(v) ? p.filter((s) => s !== v) : [...p, v])} />
      </div>

      <div className="bg-card rounded-lg border shadow-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr><th>ID</th><th>Type</th><th>Product</th><th>Qty</th><th>From</th><th>To</th><th>Reference</th><th>Date</th><th>By</th></tr>
          </thead>
          <tbody>
            {filtered.map((m: StockMovement) => (
              <tr key={m.id}>
                <td className="font-mono text-xs">MOV-{m.id}</td>
                <td><span className={`status-badge ${typeStyle[m.movementType] ?? "bg-muted text-muted-foreground"} flex items-center gap-1`}>{typeIcon[m.movementType] ?? null} {m.movementType}</span></td>
                <td>
                  <div className="font-medium">{m.productName ?? "Product #" + m.productId}</div>
                  <div className="text-xs text-muted-foreground">{m.sku ?? ""}</div>
                </td>
                <td className="font-medium">{m.quantity}</td>
                <td className="text-sm text-muted-foreground">{m.fromLocation ?? "—"}</td>
                <td className="text-sm text-muted-foreground">{m.toLocation ?? "—"}</td>
                <td className="text-xs font-mono text-muted-foreground">{m.referenceNumber ?? "—"}</td>
                <td className="text-sm text-muted-foreground whitespace-nowrap">{new Date(m.createdAt).toLocaleString()}</td>
                <td className="text-sm">{m.performedBy ?? "—"}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={9} className="text-center text-muted-foreground py-12">No movements found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <AddMovementDialog open={addOpen} onOpenChange={setAddOpen} />
      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} title="Movements" data={filtered as unknown as Record<string, unknown>[]} />
    </div>
  );
};

export default MovementsPage;
