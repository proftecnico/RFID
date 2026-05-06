import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const existingAdmin = await prisma.user.findUnique({
    where: { username: "admin" },
  });

  if (existingAdmin) {
    console.log("Admin user already exists");
    return;
  }

  const passwordHash = await bcrypt.hash("admin2026", 10);
  await prisma.user.create({
    data: {
      username: "admin",
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log("Admin created! Username: admin, Password: admin2026");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
