/**
 * exportUtils.ts
 * Client-side only — no backend calls needed.
 * Usage:
 *   exportData({ data: inventoryItems, fileName: 'inventory', format: 'csv' })
 */

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

export type ExportFormat = 'csv' | 'xlsx' | 'json' | 'pdf';

interface ExportOptions {
  data: Record<string, unknown>[];
  fileName: string;
  format: ExportFormat;
  /** Optional: restrict which keys appear in the export */
  columns?: string[];
}

function filterColumns(
  data: Record<string, unknown>[],
  columns?: string[]
): Record<string, unknown>[] {
  if (!columns || columns.length === 0) return data;
  return data.map((row) =>
    Object.fromEntries(columns.map((col) => [col, row[col]]))
  );
}

export function exportData({ data, fileName, format, columns }: ExportOptions): void {
  const filtered = filterColumns(data, columns);

  switch (format) {
    case 'csv':
    case 'xlsx': {
      const ws = XLSX.utils.json_to_sheet(filtered);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      if (format === 'csv') {
        const csvOutput = XLSX.utils.sheet_to_csv(ws);
        const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `${fileName}.csv`);
      } else {
        const xlsxBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([xlsxBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(blob, `${fileName}.xlsx`);
      }
      break;
    }

    case 'json': {
      const json = JSON.stringify(filtered, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      saveAs(blob, `${fileName}.json`);
      break;
    }

    case 'pdf': {
      const doc = new jsPDF();
      const headers = filtered.length > 0 ? Object.keys(filtered[0]) : [];
      const rows = filtered.map((row) => headers.map((h) => String(row[h] ?? '')));
      doc.setFontSize(14);
      doc.text(fileName.replace(/-/g, ' ').toUpperCase(), 14, 16);
      autoTable(doc, {
        head: [headers],
        body: rows,
        startY: 22,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] },
      });
      doc.save(`${fileName}.pdf`);
      break;
    }
  }
}
