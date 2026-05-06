"use client";

import { updateTagContainer } from "@/app/actions/tags";
import { Box, Tag as TagIcon } from "lucide-react";

interface Container {
  id: string;
  brand: string;
  model: string;
}

interface Tag {
  id: string;
  epc: string;
  createdAt: Date;
  containerTypeId: string | null;
  containerType: { brand: string; model: string } | null;
}

interface TagRowProps {
  tag: Tag;
  containers: Container[];
}

export function TagRow({ tag, containers }: TagRowProps) {
  return (
    <tr className="hover:bg-slate-800/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <TagIcon size={16} />
          </div>
          <span className="text-sm font-mono text-slate-200 tracking-wider">
            {tag.epc}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
        {new Date(tag.createdAt).toLocaleDateString()}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <form action={updateTagContainer} className="flex items-center gap-2">
          <input type="hidden" name="tagId" value={tag.id} />
          <div className="relative">
            <select
              name="containerTypeId"
              defaultValue={tag.containerTypeId || ""}
              className="appearance-none w-64 pl-10 pr-8 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-slate-200"
              onChange={(e) => e.target.form?.requestSubmit()}
            >
              <option value="" disabled>Seleccionar contenedor...</option>
              {containers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.brand} - {c.model}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Box size={14} />
            </div>
          </div>
          <span className="text-xs text-emerald-400 ml-2">
            {tag.containerType ? "Asignado" : ""}
          </span>
        </form>
      </td>
    </tr>
  );
}
