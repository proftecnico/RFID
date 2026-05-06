"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSuppliers() {
  return await prisma.supplier.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createSupplier(formData: FormData) {
  const name = formData.get("name") as string;
  const details = formData.get("details") as string;

  if (!name) return { error: "El nombre es requerido." };

  try {
    await prisma.supplier.create({
      data: { name, details },
    });
    revalidatePath("/dashboard/suppliers");
    return { success: true };
  } catch (e) {
    const error = e as { code?: string };
    if (error.code === "P2002") return { error: "El proveedor ya existe." };
    return { error: "Error al crear proveedor." };
  }
}

export async function deleteSupplier(id: string) {
  try {
    await prisma.supplier.delete({ where: { id } });
    revalidatePath("/dashboard/suppliers");
    return { success: true };
  } catch {
    return { error: "Error al borrar proveedor. Puede estar en uso." };
  }
}
