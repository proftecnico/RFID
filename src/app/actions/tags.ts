"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTags() {
  return await prisma.tag.findMany({
    include: { containerType: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateTagContainer(formData: FormData): Promise<void> {
  const tagId = formData.get("tagId") as string;
  const containerTypeId = formData.get("containerTypeId") as string;

  if (!tagId || !containerTypeId) return;

  await prisma.tag.update({
    where: { id: tagId },
    data: { containerTypeId },
  });
  revalidatePath("/dashboard/tags");
}
