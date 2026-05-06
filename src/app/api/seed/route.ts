import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { username: "admin" },
    });

    if (existingAdmin) {
      return NextResponse.json({ info: "Admin user already exists", username: "admin" });
    }

    const passwordHash = await bcrypt.hash("admin2026", 10);
    await prisma.user.create({
      data: {
        username: "admin",
        passwordHash,
        role: "ADMIN",
      },
    });

    return NextResponse.json({ success: true, message: "Admin created! Username: admin, Password: admin2026" });
  } catch (error) {
    const err = error as Error;
    return NextResponse.json({ error: err.message, stack: err.stack }, { status: 500 });
  }
}
