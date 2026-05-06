import { getMovements } from "@/app/actions/movements";
import { getSuppliers } from "@/app/actions/suppliers";
import { FileText, Download } from "lucide-react";
import { MovementRow, MovementRowProps } from "./MovementRow";

export default async function ReportsPage() {
  const movements = await getMovements();
  const suppliers = await getSuppliers();

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-950">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <FileText className="text-blue-500" />
            Reporte de Movimientos
          </h1>
          <p className="text-slate-400 mt-1 pb-4">
            Historial de entradas y salidas. Asigna el proveedor a cada movimiento.
          </p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/20 border border-emerald-500/50">
          <Download size={18} />
          Exportar a Excel
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Fecha y Hora
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Dirección
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Tag / Contenedor
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Proveedor Asignado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900">
              {movements.map((m) => (
                <MovementRow key={m.id} movement={m as MovementRowProps['movement']} suppliers={suppliers} />
              ))}
            </tbody>
          </table>
          {movements.length === 0 && (
            <div className="text-center py-10 text-slate-500">
              No hay movimientos registrados.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
