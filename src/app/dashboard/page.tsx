"use client";

import { useEffect, useState } from "react";
import { Activity, ArrowDownToLine, ArrowUpFromLine, Tag } from "lucide-react";

type Movement = {
  id: string;
  timestamp: string;
  tag: { epc: string; containerType?: { brand: string; model: string } };
  direction: "ENTRY" | "EXIT";
  antennaPort: number;
};

export default function DashboardPage() {
  const [entries, setEntries] = useState<Movement[]>([]);
  const [exits, setExits] = useState<Movement[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource("/api/stream");

    eventSource.onopen = () => setIsConnected(true);
    eventSource.onerror = () => setIsConnected(false);

    eventSource.onmessage = (event) => {
      try {
        const movement: Movement = JSON.parse(event.data);
        if (movement.direction === "ENTRY") {
          setEntries((prev) => [movement, ...prev].slice(0, 50)); // Keep last 50
        } else {
          setExits((prev) => [movement, ...prev].slice(0, 50));
        }
      } catch (err) {
        console.error("Failed to parse SSE message", err);
      }
    };

    return () => {
      eventSource.close();
      setIsConnected(false);
    };
  }, []);

  const FeedItem = ({ movement }: { movement: Movement }) => (
    <div className="flex items-center justify-between p-4 bg-slate-800/50 hover:bg-slate-800 transition-colors border-b border-slate-800 last:border-0">
      <div className="flex items-center gap-4">
        <div className={`p-2 rounded-full ${movement.direction === 'ENTRY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
          {movement.direction === 'ENTRY' ? <ArrowDownToLine size={24} /> : <ArrowUpFromLine size={24} />}
        </div>
        <div>
          <p className="text-white font-medium font-mono text-sm tracking-widest">{movement.tag.epc}</p>
          <div className="flex items-center gap-2 mt-1">
            <Tag size={12} className="text-slate-500" />
            <span className="text-xs text-slate-400">
              {movement.tag.containerType ? `${movement.tag.containerType.brand} ${movement.tag.containerType.model}` : "Sin Asignar"}
            </span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm text-slate-300 font-medium">{new Date(movement.timestamp).toLocaleTimeString()}</p>
        <span className="text-xs text-slate-500">Puerto {movement.antennaPort}</span>
      </div>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-950">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Activity className="text-blue-500" />
            Monitor en Vivo
          </h1>
          <p className="text-slate-400 mt-1 md:pb-4">
            Lecturas de antenas en tiempo real.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-full w-full md:w-auto justify-center md:justify-start">
          <div className={`h-2.5 w-2.5 rounded-full ${isConnected ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
          <span className="text-sm font-medium text-slate-300">
            {isConnected ? "Conectado al Lector" : "Desconectado"}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col h-[70vh]">
          <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-emerald-400 flex items-center gap-2">
              <ArrowDownToLine size={20} /> Entradas
            </h2>
            <span className="text-xs font-mono bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/30">
              Antena Interior (P8)
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {entries.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center">
                <ArrowDownToLine size={48} className="mb-4 opacity-20" />
                <p>Esperando lecturas de entrada...</p>
              </div>
            ) : (
              entries.map((m) => <FeedItem key={m.id} movement={m} />)
            )}
          </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl flex flex-col h-[70vh]">
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-amber-400 flex items-center gap-2">
              <ArrowUpFromLine size={20} /> Salidas
            </h2>
            <span className="text-xs font-mono bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/30">
              Antena Exterior (P9)
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {exits.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center">
                <ArrowUpFromLine size={48} className="mb-4 opacity-20" />
                <p>Esperando lecturas de salida...</p>
              </div>
            ) : (
              exits.map((m) => <FeedItem key={m.id} movement={m} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
