import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Package,
  ShoppingCart,
  Warehouse,
  ArrowLeftRight,
  Search,
  Bell,
  Settings,
  LayoutDashboard,
  CreditCard,
} from "lucide-react";
import { useInventory, type InventoryItem } from "@/hooks/useInventory";
import { useOrders, type Order } from "@/hooks/useOrders";
import { useWarehouses, type Warehouse as WarehouseType } from "@/hooks/useWarehouses";
import { useMovements } from "@/hooks/useMovements";

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const quickLinks = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Inventory", path: "/dashboard/inventory", icon: Package },
  { label: "Orders", path: "/dashboard/orders", icon: ShoppingCart },
  { label: "Warehouses", path: "/dashboard/warehouses", icon: Warehouse },
  { label: "Movements", path: "/dashboard/movements", icon: ArrowLeftRight },
  { label: "Alerts", path: "/dashboard/alerts", icon: Bell },
  { label: "Billing", path: "/dashboard/billing", icon: CreditCard },
  { label: "Settings", path: "/dashboard/settings", icon: Settings },
];

const GlobalSearch: React.FC<GlobalSearchProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();

  // Fetch data for search
  const { data: inventoryPage } = useInventory(0, 100);
  const { data: orders } = useOrders();
  const { data: warehouses } = useWarehouses();
  const { data: movements } = useMovements();

  const inventoryItems = inventoryPage?.content || [];

  const handleSelect = useCallback(
    (path: string) => {
      onOpenChange(false);
      navigate(path);
    },
    [navigate, onOpenChange]
  );

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search inventory, orders, warehouses, pages..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Quick Navigation */}
        <CommandGroup heading="Pages">
          {quickLinks.map((link) => (
            <CommandItem
              key={link.path}
              value={`page ${link.label}`}
              onSelect={() => handleSelect(link.path)}
            >
              <link.icon className="mr-2 h-4 w-4 text-muted-foreground" />
              <span>{link.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Inventory Results */}
        {inventoryItems.length > 0 && (
          <CommandGroup heading="Inventory">
            {inventoryItems.slice(0, 8).map((item: InventoryItem) => (
              <CommandItem
                key={`inv-${item.id}`}
                value={`inventory ${item.sku} ${item.productName} ${item.category || ""}`}
                onSelect={() => handleSelect("/dashboard/inventory")}
              >
                <Package className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{item.productName}</span>
                  <span className="text-xs text-muted-foreground">
                    SKU: {item.sku} · Qty: {item.quantity} · {item.warehouseName || "N/A"}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator />

        {/* Order Results */}
        {orders && orders.length > 0 && (
          <CommandGroup heading="Orders">
            {orders.slice(0, 8).map((order: Order) => (
              <CommandItem
                key={`ord-${order.id}`}
                value={`order ${order.orderNumber} ${order.customerName} ${order.status}`}
                onSelect={() => handleSelect("/dashboard/orders")}
              >
                <ShoppingCart className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {order.orderNumber} — {order.customerName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {order.status} · ${order.totalAmount?.toLocaleString() || "0"}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator />

        {/* Warehouse Results */}
        {warehouses && warehouses.length > 0 && (
          <CommandGroup heading="Warehouses">
            {warehouses.slice(0, 8).map((wh: WarehouseType) => (
              <CommandItem
                key={`wh-${wh.id}`}
                value={`warehouse ${wh.warehouseCode} ${wh.name} ${wh.location} ${wh.city || ""}`}
                onSelect={() => handleSelect("/dashboard/warehouses")}
              >
                <Warehouse className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{wh.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {wh.warehouseCode} · {wh.location} · {wh.status}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        <CommandSeparator />

        {/* Movement Results */}
        {movements && movements.length > 0 && (
          <CommandGroup heading="Movements">
            {movements.slice(0, 5).map((mov: any) => (
              <CommandItem
                key={`mov-${mov.id}`}
                value={`movement ${mov.sku || ""} ${mov.movementType || ""} ${mov.referenceNumber || ""}`}
                onSelect={() => handleSelect("/dashboard/movements")}
              >
                <ArrowLeftRight className="mr-2 h-4 w-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {mov.movementType} — {mov.sku || "N/A"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Qty: {mov.quantity} · {mov.referenceNumber || ""}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default GlobalSearch;
