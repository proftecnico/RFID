import { getContainerTypes, createContainerType, deleteContainerType } from "@/app/actions/containers";
import { Box, Trash2, Tag as TagIcon } from "lucide-react";

export default async function ContainersPage() {
  const containers = await getContainerTypes();

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-950">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Box className="text-blue-500" />
            Marcas y Modelos
          </h1>
          <p className="text-slate-400 mt-1 pb-4">
            Catalogo de tipos de contenedores (EJ: Bin Humedos, Bilaterales, Camion).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Container Form */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full filter blur-3xl -mr-10 -mt-10" />
            <h2 className="text-xl font-semibold text-white mb-6 relative">
              Nuevo Contenedor
            </h2>
            <form action={async (formData) => { "use server"; await createContainerType(formData); }} className="space-y-4 relative">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Marca
                </label>
                <input
                  name="brand"
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-amber-500 text-slate-100 placeholder-slate-500"
                  placeholder="Ej. Contenur"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Modelo
                </label>
                <input
                  name="model"
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-amber-500 text-slate-100 placeholder-slate-500"
                  placeholder="Ej. Bilateral 3200L"
                />
              </div>
              
              <button
                type="submit"
                className="w-full mt-4 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-amber-600 hover:bg-amber-700 transition-colors"
              >
                Registrar Modelo
              </button>
            </form>
          </div>
        </div>

        {/* Containers List */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-800">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Marca y Modelo
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Tags Asignados
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900">
                  {containers.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Box size={16} />
                          </div>
                          <div>
                            <span className="block text-sm font-medium text-slate-200">
                              {c.brand}
                            </span>
                            <span className="block text-xs text-slate-400 mt-0.5">
                              {c.model}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          <TagIcon size={12} className="text-slate-400" />
                          {c._count.tags}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <form action={async () => {
                          "use server";
                          await deleteContainerType(c.id);
                        }}>
                          <button className="text-slate-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-slate-800" title="Borrar Contenedor">
                            <Trash2 size={18} />
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {containers.length === 0 && (
                <div className="text-center py-10 text-slate-500">
                  No hay marcas ni modelos registrados.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
