"use client";

import { Download } from "lucide-react";

type Movement = {
  id: string;
  timestamp: Date;
  direction: string;
  tag: {
    epc: string;
    containerType?: {
      brand: string;
      model: string;
    } | null;
  };
  supplier?: {
    name: string;
  } | null;
};

export function ExportButton({ movements }: { movements: any[] }) {
  const downloadCSV = () => {
    if (movements.length === 0) return;

    const headers = "ID,Fecha y Hora,Direccion,EPC,Marca y Modelo,Proveedor\n";
    const csvContent = movements.map(m => {
      const date = new Date(m.timestamp).toLocaleString();
      const container = m.tag?.containerType ? `${m.tag.containerType.brand} ${m.tag.containerType.model}` : "Sin Asignar";
      const supplier = m.supplier?.name || "Sin Proveedor";
      return `"${m.id}","${date}","${m.direction}","${m.tag?.epc || ''}","${container}","${supplier}"`;
    }).join("\n");

    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `reporte_movimientos_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button 
      onClick={downloadCSV}
      disabled={movements.length === 0}
      className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/20 border border-emerald-500/50"
    >
      <Download size={18} />
      Exportar a Excel
    </button>
  );
}
