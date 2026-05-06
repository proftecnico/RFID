import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { epc, antennaPort } = body;

    if (!epc || !antennaPort) {
      return NextResponse.json({ error: "Missing epc or antennaPort" }, { status: 400 });
    }

    // Determine direction based on configured antennas
    let direction = "ENTRY";
    try {
      const antennas = await prisma.$queryRaw`SELECT * FROM AntennaConfig WHERE isActive = 1` as any[];
      const ant = antennas.find((a: any) => a.port === antennaPort);
      if (ant) {
        const desc = (ant.description || ant.name).toLowerCase();
        direction = desc.includes("salida") || desc.includes("exit") ? "EXIT" : "ENTRY";
      }
    } catch {
      direction = antennaPort === 8 || antennaPort === "COM8" ? "ENTRY" : "EXIT";
    }

    // Upsert Tag
    let tag: any = await prisma.tag.findUnique({ where: { epc } });
    if (!tag) {
      tag = await prisma.tag.create({
        data: { epc, isActive: true }
      });
    }

    // Create the Movement record
    const movement = await prisma.movement.create({
      data: {
        tagId: tag.id,
        direction,
        antennaPort: typeof antennaPort === 'string' ? parseInt(antennaPort.replace('COM', '')) || 0 : antennaPort,
      },
      include: {
        tag: {
          include: { containerType: true }
        },
        supplier: true
      }
    });

    const globalAny = global as { rfidEmitter?: EventTarget };
    if (globalAny.rfidEmitter) {
      globalAny.rfidEmitter.dispatchEvent(new CustomEvent('reading', { detail: movement }));
    }

    return NextResponse.json({ success: true, movement }, { status: 201 });
  } catch (error) {
    console.error("Error processing RFID reading:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
