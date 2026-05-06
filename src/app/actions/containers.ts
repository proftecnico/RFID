"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getContainerTypes() {
  return await prisma.containerType.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { tags: true }
      }
    }
  });
}

export async function createContainerType(formData: FormData) {
  const brand = formData.get("brand") as string;
  const model = formData.get("model") as string;

  if (!brand || !model) return { error: "Marca y modelo son requeridos." };

  try {
    await prisma.containerType.create({
      data: { brand, model },
    });
    revalidatePath("/dashboard/containers");
    return { success: true };
  } catch (e) {
    const error = e as { code?: string };
    if (error.code === "P2002") return { error: "Esa marca y modelo ya existe." };
    return { error: "Error al crear tipo de contenedor." };
  }
}

export async function deleteContainerType(id: string) {
  try {
    await prisma.containerType.delete({ where: { id } });
    revalidatePath("/dashboard/containers");
    return { success: true };
  } catch {
    return { error: "Error al borrar. Puede que el contenedor esté en uso por algún Tag." };
  }
}
