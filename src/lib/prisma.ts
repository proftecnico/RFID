import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getClient() {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  const client = new PrismaClient({ log: ["error", "warn"] });
  return client;
}

export const prisma = getClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
