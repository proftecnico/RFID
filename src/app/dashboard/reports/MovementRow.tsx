"use client";

import { assignSupplierToMovement } from "@/app/actions/movements";
import { ArrowDownToLine, ArrowUpFromLine, Tag } from "lucide-react";

interface Supplier {
  id: string;
  name: string;
}

interface ContainerType {
  brand: string;
  model: string;
}

interface Tag {
  epc: string;
  containerType: ContainerType | null;
}

interface Movement {
  id: string;
  timestamp: Date;
  direction: "ENTRY" | "EXIT";
  tag: Tag;
  supplierId: string | null;
}

export interface MovementRowProps {
  movement: Movement;
  suppliers: Supplier[];
}

export function MovementRow({ movement, suppliers }: MovementRowProps) {
  return (
    <tr className="hover:bg-slate-800/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
        {new Date(movement.timestamp).toLocaleString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${movement.direction === 'ENTRY' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
            {movement.direction === 'ENTRY' ? <ArrowDownToLine size={14} /> : <ArrowUpFromLine size={14} />}
            {movement.direction === 'ENTRY' ? 'ENTRADA' : 'SALIDA'}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex flex-col">
          <span className="text-sm font-mono text-slate-200">{movement.tag.epc}</span>
          <span className="text-xs flex flex-row items-center gap-1 text-slate-400 mt-1">
            <Tag size={10} className="text-slate-500"/>
            {movement.tag.containerType ? `${movement.tag.containerType.brand} ${movement.tag.containerType.model}` : "Sin clasificar"}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <form action={assignSupplierToMovement} className="flex flex-col gap-1 w-full max-w-xs">
          <input type="hidden" name="movementId" value={movement.id} />
          <select
            name="supplierId"
            defaultValue={movement.supplierId || ""}
            className="w-full pl-3 pr-8 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-slate-200"
            onChange={(e) => e.target.form?.requestSubmit()}
          >
            <option value="" disabled>Asignar proveedor...</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </form>
      </td>
    </tr>
  );
}
