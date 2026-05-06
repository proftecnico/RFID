"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getMovements() {
  return await prisma.movement.findMany({
    take: 100, // Limit for performance, in a real app use pagination
    orderBy: { timestamp: "desc" },
    include: {
      tag: { include: { containerType: true } },
      supplier: true,
    },
  });
}

export async function assignSupplierToMovement(formData: FormData): Promise<void> {
  const movementId = formData.get("movementId") as string;
  const supplierId = formData.get("supplierId") as string;
  
  if (!movementId || !supplierId) return;

  await prisma.movement.update({
    where: { id: movementId },
    data: { supplierId },
  });
  revalidatePath("/dashboard/reports");
}
