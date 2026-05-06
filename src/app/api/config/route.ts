import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { prisma } = await import("@/lib/prisma");
    const antennas = await prisma.antennaConfig.findMany({
      where: { isActive: true }
    });
    return NextResponse.json(antennas);
  } catch {
    return NextResponse.json([
      { name: "Antena 1", port: "COM3", description: "Entrada" },
      { name: "Antena 2", port: "COM4", description: "Salida" }
    ]);
  }
}