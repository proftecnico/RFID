import { getSession, logout } from "@/lib/auth";
import { Users, Truck, Box, Radio, Activity, LogOut, Tag as TagIcon, FileText, Settings, Wifi } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 text-blue-500 rounded-lg">
              <Radio size={20} />
            </div>
            <span className="font-bold text-lg tracking-wide text-white">
              RFID Hub
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Activity size={20} />
            Monitor en Vivo
          </Link>
          <Link
            href="/dashboard/viewer"
            className="flex items-center gap-3 px-3 py-2 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Wifi size={20} />
            Visor Local RFID
          </Link>
          <Link
            href="/dashboard/reports"
            className="flex items-center gap-3 px-3 py-2 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            <FileText size={20} />
            Reporte de Movimientos
          </Link>
          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Catálogos
          </div>
          <Link
            href="/dashboard/tags"
            className="flex items-center gap-3 px-3 py-2 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            <TagIcon size={20} />
            Etiquetas RFID
          </Link>
          <Link
            href="/dashboard/suppliers"
            className="flex items-center gap-3 px-3 py-2 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Truck size={20} />
            Proveedores
          </Link>
          <Link
            href="/dashboard/containers"
            className="flex items-center gap-3 px-3 py-2 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Box size={20} />
            Marcas y Modelos
          </Link>

          <Link
            href="/dashboard/config"
            className="flex items-center gap-3 px-3 py-2 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            <Settings size={20} />
            Configuración
          </Link>

          {session?.user.role === "ADMIN" && (
            <>
              <div className="pt-4 pb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Seguridad
              </div>
              <Link
                href="/dashboard/users"
                className="flex items-center gap-3 px-3 py-2 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
              >
                <Users size={20} />
                Usuarios
              </Link>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-sm font-medium text-slate-400">
              {session?.user.username}
            </span>
          </div>
          <form
            action={async () => {
              "use server";
              await logout();
              redirect("/login");
            }}
          >
            <button className="w-full flex items-center gap-3 px-3 py-2 text-red-400 rounded-lg hover:bg-slate-800 hover:text-red-300 transition-colors">
              <LogOut size={20} />
              Cerrar Sesión
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {children}
      </main>
    </div>
  );
}
