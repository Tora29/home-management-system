import bcrypt from "bcrypt";

import type { PrismaClient } from "../generated/prisma/client";

// テスト用のパスワード（本番環境では使用しないこと）
const TEST_PASSWORD = "password123";
const SALT_ROUNDS = 10;

export async function seedUser(prisma: PrismaClient) {
  console.log("📝 Seeding users...");

  // テスト用パスワードをハッシュ化
  const passwordHash = await bcrypt.hash(TEST_PASSWORD, SALT_ROUNDS);

  const users = [
    { email: "admin@example.com", name: "Admin User", passwordHash },
    { email: "user@example.com", name: "Test User", passwordHash },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: { passwordHash: user.passwordHash },
      create: user,
    });
  }

  console.log(`  ✓ ${users.length} users seeded`);
  console.log(`  ℹ️  Test password: ${TEST_PASSWORD}`);
}
