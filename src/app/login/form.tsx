"use client";

import { useActionState } from "react";
import { loginUser } from "@/app/actions/auth";

const initialState = { error: "" };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginUser, initialState);

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-sm text-red-400">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="username" className="block text-sm font-medium text-slate-300">
          Usuario
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          disabled={isPending}
          className="mt-1 block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
          placeholder="admin"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-300">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          disabled={isPending}
          className="mt-1 block w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-blue-500 disabled:opacity-50"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 px-4 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
