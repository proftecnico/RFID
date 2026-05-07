"use client";

import { useEffect, useState } from "react";
import { Activity, RefreshCw, Trash2, Tag, Radio, Download, List, Layers } from "lucide-react";

type Movement = {
  id: string;
  timestamp: string;
  tag: { epc: string; containerType?: { brand: string; model: string } };
  direction: "ENTRY" | "EXIT";
  antennaPort: number;
};

type TagData = {
  epc: string;
  count: number;
  antennaPort: number;
  firstSeen: string;
  lastSeen: string;
  brand: string;
  model: string;
};

export default function ViewerPage() {
  const [tags, setTags] = useState<Record<string, TagData>>({});
  const [history, setHistory] = useState<Movement[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [viewMode, setViewMode] = useState<"GROUPED" | "HISTORY">("GROUPED");

  useEffect(() => {
    const eventSource = new EventSource("/api/stream");

    eventSource.onopen = () => setIsConnected(true);
    eventSource.onerror = () => setIsConnected(false);

    eventSource.onmessage = (event) => {
      try {
        const movement: Movement = JSON.parse(event.data);
        const epc = movement.tag.epc;
        const brand = movement.tag.containerType?.brand || "";
        const model = movement.tag.containerType?.model || "";

        // Guardar en histórico
        setHistory((prev) => [movement, ...prev]);

        // Actualizar agrupado
        setTags((prev) => {
          const existing = prev[epc];
          if (existing) {
            return {
              ...prev,
              [epc]: {
                ...existing,
                count: existing.count + 1,
                lastSeen: movement.timestamp,
                antennaPort: movement.antennaPort,
              },
            };
          } else {
            return {
              ...prev,
              [epc]: {
                epc,
                count: 1,
                antennaPort: movement.antennaPort,
                firstSeen: movement.timestamp,
                lastSeen: movement.timestamp,
                brand,
                model,
              },
            };
          }
        });
      } catch (err) {
        console.error("Failed to parse SSE message", err);
      }
    };

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, []);

  const clearData = () => {
    setTags({});
    setHistory([]);
  };

  const downloadCSV = () => {
    if (history.length === 0) return;

    const headers = "ID,Fecha y Hora,EPC,Puerto Antena,Direccion,Marca,Modelo\n";
    const csvContent = history.map(m => {
      const date = new Date(m.timestamp).toLocaleString();
      const brand = m.tag.containerType?.brand || "Desconocido";
      const model = m.tag.containerType?.model || "";
      return `${m.id},"${date}",${m.tag.epc},${m.antennaPort},${m.direction},"${brand}","${model}"`;
    }).join("\n");

    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `historico_rfid_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tagList = Object.values(tags).sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime());

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-950 min-h-screen">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Radio className="text-blue-500" />
            Visor Local RFID
          </h1>
          <p className="text-slate-400 mt-1 md:pb-4">
            Emulación del programa de lectura y registro histórico.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg justify-center">
            <div className={`h-2.5 w-2.5 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
            <span className="text-sm font-medium text-slate-300">
              {isConnected ? "Conectado" : "Desconectado"}
            </span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={downloadCSV}
              disabled={history.length === 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-lg transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={16} /> <span className="hidden sm:inline">Descargar</span> CSV
            </button>
            <button 
              onClick={clearData}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors text-sm font-medium"
            >
              <Trash2 size={16} /> Limpiar
            </button>
          </div>
        </div>
      </div>
      
      {/* Pestañas de Vista */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-2">
        <button
          onClick={() => setViewMode("GROUPED")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === "GROUPED" 
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30" 
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <Layers size={18} />
          Agrupado por EPC
        </button>
        <button
          onClick={() => setViewMode("HISTORY")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            viewMode === "HISTORY" 
              ? "bg-blue-600/20 text-blue-400 border border-blue-500/30" 
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
          }`}
        >
          <List size={18} />
          Historial Completo
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto max-h-[60vh] overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-900 z-10 shadow-sm">
              <tr className="bg-slate-800/80 border-b border-slate-700/50 backdrop-blur-sm">
                <th className="px-6 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  {viewMode === "HISTORY" ? "Hora" : "Primera Vez"}
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">EPC</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">Antena</th>
                {viewMode === "GROUPED" && (
                  <th className="px-6 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">Lecturas</th>
                )}
                <th className="px-6 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">Tipo / Modelo</th>
                {viewMode === "GROUPED" && (
                  <th className="px-6 py-4 text-xs font-semibold text-slate-300 uppercase tracking-wider">Última Vez</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {(viewMode === "GROUPED" ? tagList : history).length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-3">
                      <RefreshCw size={32} className={`opacity-20 ${isConnected ? 'animate-spin' : ''}`} />
                      <p>Esperando lecturas de las antenas...</p>
                    </div>
                  </td>
                </tr>
              ) : (
                viewMode === "GROUPED" ? (
                  // VISTA AGRUPADA
                  tagList.map((tag) => (
                    <tr key={tag.epc} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(tag.firstSeen).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-mono text-sm font-medium text-emerald-400">
                          {tag.epc}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {tag.antennaPort}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-slate-300 font-mono bg-slate-800 px-3 py-1 rounded text-sm">
                          {tag.count}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Tag size={14} className="text-slate-500" />
                          <span className="text-sm text-slate-400">
                            {tag.brand ? `${tag.brand} ${tag.model}` : "Desconocido"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {new Date(tag.lastSeen).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  // VISTA HISTORIAL
                  history.map((movement) => (
                    <tr key={movement.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                        {new Date(movement.timestamp).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-mono text-sm font-medium text-emerald-400">
                          {movement.tag.epc}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {movement.antennaPort}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Tag size={14} className="text-slate-500" />
                          <span className="text-sm text-slate-400">
                            {movement.tag.containerType?.brand ? `${movement.tag.containerType.brand} ${movement.tag.containerType.model}` : "Desconocido"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>
        
        <div className="bg-slate-800/30 px-6 py-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-500">
          <span>Total de etiquetas únicas: {tagList.length}</span>
          <span>Lecturas totales guardadas: {history.length}</span>
        </div>
      </div>
    </div>
  );
}
