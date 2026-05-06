"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function getUsers() {
  return await prisma.user.findMany({
    select: { id: true, username: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createUser(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!username || !password) return { error: "Faltan campos." };

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { username, passwordHash, role: role || "USER" },
    });
    revalidatePath("/dashboard/users");
    return { success: true };
  } catch (e) {
    const error = e as { code?: string };
    if (error.code === "P2002") return { error: "El usuario ya existe." };
    return { error: "Error al crear usuario." };
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath("/dashboard/users");
    return { success: true };
  } catch {
    return { error: "Error al borrar usuario." };
  }
}
