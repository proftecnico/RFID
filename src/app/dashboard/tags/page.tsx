import { getTags } from "@/app/actions/tags";
import { getContainerTypes } from "@/app/actions/containers";
import { Tag as TagIcon } from "lucide-react";
import { TagRow } from "./TagRow";

export default async function TagsPage() {
  const tags = await getTags();
  const containers = await getContainerTypes();

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-950">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <TagIcon className="text-blue-500" />
            Asignación de Tags
          </h1>
          <p className="text-slate-400 mt-1 pb-4">
            Relaciona los códigos EPC leídos por la antena con marcas y modelos de contenedor.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Código Tag (EPC)
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Fecha Registro
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Asignación de Contenedor
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900">
              {tags.map((tag) => (
                <TagRow key={tag.id} tag={tag} containers={containers} />
              ))}
            </tbody>
          </table>
          {tags.length === 0 && (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-slate-600 mb-4 bg-slate-800 rounded-full flex items-center justify-center">
                <TagIcon size={24} />
              </div>
              <p className="text-slate-400">No se han registrado etiquetas aún.</p>
              <p className="text-slate-500 text-sm mt-1">Pasa un tag por la antena para que aparezca aquí.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
