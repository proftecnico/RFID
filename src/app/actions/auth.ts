"use server";

import { prisma } from "@/lib/prisma";
import { login } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

interface LoginState {
  error?: string;
}

export async function loginUser(state: LoginState, formData: FormData): Promise<LoginState> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return { error: "Usuario y contraseña son requeridos" };
  }

  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    return { error: "Credenciales inválidas" };
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    return { error: "Credenciales inválidas" };
  }

  await login({
    id: user.id,
    username: user.username,
    role: user.role,
  });

  redirect("/dashboard");
}

export async function createAdminUser() {
  const existingAdmin = await prisma.user.findUnique({
    where: { username: "admin" },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("admin2026", 10);
    await prisma.user.create({
      data: {
        username: "admin",
        passwordHash,
        role: "ADMIN",
      },
    });
    return { success: "Admin creado" };
  }
  return { info: "Admin ya existe" };
}
