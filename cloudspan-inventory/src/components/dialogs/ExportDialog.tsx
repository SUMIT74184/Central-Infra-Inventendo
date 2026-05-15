import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDown, FileSpreadsheet, FileText, File } from "lucide-react";
import { toast } from "sonner";
import { exportData, type ExportFormat } from "@/utils/exportUtils";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  data?: Record<string, unknown>[];
}

const formats = [
  { value: "csv", label: "CSV (.csv)", icon: FileSpreadsheet, desc: "Comma-separated values" },
  { value: "xlsx", label: "Excel (.xlsx)", icon: FileSpreadsheet, desc: "Microsoft Excel workbook" },
  { value: "json", label: "JSON (.json)", icon: File, desc: "JavaScript Object Notation" },
  { value: "pdf", label: "PDF (.pdf)", icon: FileText, desc: "Portable Document Format" },
];

const ExportDialog: React.FC<Props> = ({ open, onOpenChange, title, data = [] }) => {
  const [format, setFormat] = useState("csv");
  const [range, setRange] = useState("all");

  const handleExport = () => {
    if (data.length === 0) { toast.warning("No data to export"); return; }
    try {
      exportData({ data, fileName: title.toLowerCase().replace(/\s+/g, "-"), format: format as ExportFormat });
      toast.success(`${title} exported as ${format.toUpperCase()}`);
      onOpenChange(false);
    } catch {
      toast.error("Export failed. Please install required packages.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileDown className="h-5 w-5 text-primary" /> Export {title}
          </DialogTitle>
          <DialogDescription>Choose format and data range for export</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Export Format</Label>
            <div className="grid grid-cols-2 gap-2">
              {formats.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() => setFormat(f.value)}
                  className={`flex items-center gap-2 rounded-lg border p-3 text-left transition-colors ${
                    format === f.value ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "hover:bg-muted/50"
                  }`}
                >
                  <f.icon className={`h-4 w-4 ${format === f.value ? "text-primary" : "text-muted-foreground"}`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{f.label}</p>
                    <p className="text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Data Range</Label>
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Records</SelectItem>
                <SelectItem value="filtered">Current Filtered View</SelectItem>
                <SelectItem value="selected">Selected Items Only</SelectItem>
                <SelectItem value="last30">Last 30 Days</SelectItem>
                <SelectItem value="last90">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleExport}>
            <FileDown className="h-4 w-4 mr-1" /> Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
