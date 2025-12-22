import type { PrismaClient } from "../generated/prisma/client";

export async function seedUser(prisma: PrismaClient) {
  console.log("📝 Seeding users...");

  const users = [
    { email: "admin@example.com", name: "Admin User" },
    { email: "user@example.com", name: "Test User" },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

  console.log(`  ✓ ${users.length} users seeded`);
}
