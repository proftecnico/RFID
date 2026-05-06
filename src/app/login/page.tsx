import { LoginForm } from "./form";
import { Radio } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-16 w-16 bg-blue-600/20 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-500/30 shadow-lg shadow-blue-500/20">
            <Radio size={32} />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          RFID Admin
        </h2>
        <p className="mt-2 text-center text-sm text-slate-400">
          Sistema de Control de Activos
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-slate-800">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
