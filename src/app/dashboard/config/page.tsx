"use client";

import { useEffect, useState } from "react";
import { Save, Wifi, AlertCircle } from "lucide-react";

type Antenna = {
  id?: string;
  name: string;
  port: string;
  description: string;
  isActive: boolean;
};

export default function ConfigPage() {
  const [antennas, setAntennas] = useState<Antenna[]>([
    { name: "Antena 1", port: "COM1", description: "Entrada", isActive: true },
    { name: "Antena 2", port: "COM2", description: "Salida", isActive: true }
  ]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/antennas")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setAntennas(data);
        }
      })
      .catch(err => console.error("Failed to load antennas:", err));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch("/api/antennas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ antennas })
      });

      if (!res.ok) throw new Error("Failed to save");

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError("Error guardando configuración");
    } finally {
      setSaving(false);
    }
  };

  const updateAntenna = (index: number, field: keyof Antenna, value: string | boolean) => {
    setAntennas(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-950">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Wifi className="text-blue-500" />
            Configuración de Antenas
          </h1>
          <p className="text-slate-400 mt-1">
            Configure los puertos seriales para cada antenna RFID.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="p-6 space-y-6">
            {antennas.map((antenna, index) => (
              <div key={antenna.name} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">{antenna.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Puerto Serial
                    </label>
                    <select
                      value={antenna.port}
                      onChange={(e) => updateAntenna(index, "port", e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                    >
                      {[...Array(20)].map((_, i) => (
                        <option key={i} value={`COM${i + 1}`}>
                          COM{i + 1}
                        </option>
                      ))}
                      {[...Array(10)].map((_, i) => (
                        <option key={i + 20} value={`COM${i + 30}`}>
                          COM{i + 30}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Descripción
                    </label>
                    <input
                      type="text"
                      value={antenna.description}
                      onChange={(e) => updateAntenna(index, "description", e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                      placeholder="Ej: Entrada principal"
                    />
                  </div>
                </div>
              </div>
            ))}

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            {saved && (
              <div className="flex items-center gap-2 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
                <Save size={20} />
                Configuración guardada correctamente
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white rounded-lg font-medium transition-colors"
            >
              <Save size={20} />
              {saving ? "Guardando..." : "Guardar Configuración"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}