import { getUsers, createUser, deleteUser } from "@/app/actions/users";
import { Users, Trash2, Shield, User as UserIcon } from "lucide-react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  const session = await getSession();
  if (session?.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const users = await getUsers();

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-slate-950">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Users className="text-blue-500" />
            Gestión de Usuarios
          </h1>
          <p className="text-slate-400 mt-1 pb-4">
            Añade o elimina accesos al sistema.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create User Form */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full filter blur-3xl -mr-10 -mt-10" />
            <h2 className="text-xl font-semibold text-white mb-6 relative">
              Nuevo Usuario
            </h2>
            <form action={async (formData) => { "use server"; await createUser(formData); }} className="space-y-4 relative">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Usuario
                </label>
                <input
                  name="username"
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-slate-100"
                  placeholder="ej. operador1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Contraseña
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-slate-100"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Rol
                </label>
                <select
                  name="role"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-slate-100"
                >
                  <option value="USER">Operador (Solo lectura y reportes)</option>
                  <option value="ADMIN">Administrador (Control total)</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full mt-2 py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Crear Usuario
              </button>
            </form>
          </div>
        </div>

        {/* Users List */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-800">
                <thead className="bg-slate-900/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Rol
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Fecha de Creación
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 bg-slate-900">
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-slate-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                            {user.role === "ADMIN" ? <Shield size={16} /> : <UserIcon size={16} />}
                          </div>
                          <span className="text-sm font-medium text-slate-200">
                            {user.username}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {user.username !== session?.user.username && (
                          <form action={async () => {
                            "use server";
                            await deleteUser(user.id);
                          }}>
                            <button className="text-slate-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-slate-800">
                              <Trash2 size={18} />
                            </button>
                          </form>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="text-center py-10 text-slate-500">
                  No hay usuarios registrados.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
