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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar / Topbar */}
      <aside className="w-full md:w-64 bg-slate-900 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col shrink-0 z-50">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 justify-between md:justify-start hidden md:flex">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/20 text-blue-500 rounded-lg">
              <Radio size={20} />
            </div>
            <span className="font-bold text-lg tracking-wide text-white">
              RFID Hub
            </span>
          </div>
        </div>

        <nav className="flex px-2 py-3 space-x-1 md:space-x-0 md:space-y-1 overflow-x-auto md:flex-col md:flex-1 md:px-4 md:py-6 no-scrollbar items-center md:items-stretch">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap"
          >
            <Activity size={20} className="shrink-0" />
            <span className="hidden md:block">Monitor en Vivo</span>
          </Link>
          <Link
            href="/dashboard/viewer"
            className="flex items-center gap-3 px-3 py-2 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap"
          >
            <Wifi size={20} className="shrink-0" />
            <span className="hidden md:block">Visor Local RFID</span>
          </Link>
          <Link
            href="/dashboard/reports"
            className="flex items-center gap-3 px-3 py-2 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap"
          >
            <FileText size={20} className="shrink-0" />
            <span className="hidden md:block">Reportes</span>
          </Link>
          
          <div className="hidden md:block pt-4 pb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">
            Catálogos
          </div>
          
          <Link
            href="/dashboard/tags"
            className="flex items-center gap-3 px-3 py-2 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap"
          >
            <TagIcon size={20} className="shrink-0" />
            <span className="hidden md:block">Etiquetas RFID</span>
          </Link>
          <Link
            href="/dashboard/suppliers"
            className="flex items-center gap-3 px-3 py-2 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap"
          >
            <Truck size={20} className="shrink-0" />
            <span className="hidden md:block">Proveedores</span>
          </Link>
          <Link
            href="/dashboard/containers"
            className="flex items-center gap-3 px-3 py-2 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap"
          >
            <Box size={20} className="shrink-0" />
            <span className="hidden md:block">Marcas y Modelos</span>
          </Link>

          <Link
            href="/dashboard/config"
            className="flex items-center gap-3 px-3 py-2 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap"
          >
            <Settings size={20} className="shrink-0" />
            <span className="hidden md:block">Configuración</span>
          </Link>

          {session?.user.role === "ADMIN" && (
            <>
              <div className="hidden md:block pt-4 pb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-widest">
                Seguridad
              </div>
              <Link
                href="/dashboard/users"
                className="flex items-center gap-3 px-3 py-2 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap"
              >
                <Users size={20} className="shrink-0" />
                <span className="hidden md:block">Usuarios</span>
              </Link>
            </>
          )}
        </nav>

        <div className="hidden md:block p-4 border-t border-slate-800">
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
      <main className="flex-1 flex flex-col h-[calc(100vh-64px)] md:h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
