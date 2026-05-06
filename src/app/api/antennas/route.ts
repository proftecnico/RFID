import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS AntennaConfig (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      port TEXT NOT NULL,
      description TEXT,
      isActive INTEGER DEFAULT 1,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    )`;
  } catch {
    // Table exists
  }

  try {
    const antennas = await prisma.$queryRaw`SELECT * FROM AntennaConfig ORDER BY name`;
    return NextResponse.json(antennas);
  } catch (error) {
    console.error("Error fetching antennas:", error);
    return NextResponse.json([
      { name: "Antena 1", port: "COM3", description: "Entrada", isActive: 1 },
      { name: "Antena 2", port: "COM4", description: "Salida", isActive: 1 }
    ]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { antennas } = body;

    if (!antennas || !Array.isArray(antennas)) {
      return NextResponse.json({ error: "Invalid antennas array" }, { status: 400 });
    }

    const results = [];
    for (const ant of antennas) {
      const existing = await prisma.$queryRaw`SELECT * FROM AntennaConfig WHERE name = ${ant.name}`;
      const rows = existing as any[];
      
      if (rows.length > 0) {
        await prisma.$executeRaw`UPDATE AntennaConfig SET port = ${ant.port}, description = ${ant.description || ''}, isActive = ${ant.isActive ? 1 : 0}, updatedAt = datetime('now') WHERE name = ${ant.name}`;
      } else {
        const id = `ant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        await prisma.$executeRaw`INSERT INTO AntennaConfig (id, name, port, description, isActive, createdAt, updatedAt) VALUES (${id}, ${ant.name}, ${ant.port}, ${ant.description || ''}, ${ant.isActive ? 1 : 0}, datetime('now'), datetime('now'))`;
      }
      
      results.push(ant);
    }

    return NextResponse.json({ success: true, antennas: results });
  } catch (error) {
    console.error("Error saving antennas:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}