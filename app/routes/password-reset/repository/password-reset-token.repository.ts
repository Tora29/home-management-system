// パスワードリセットトークンのリポジトリ（Prisma呼び出しのみ）

// 共有ライブラリ
import { prisma } from "~/shared/lib/db.server";

/**
 * ユーザーIDで未使用トークンを削除
 */
export async function removeUnusedByUserId(userId: string) {
  return prisma.passwordResetToken.deleteMany({
    where: {
      userId,
      usedAt: null,
    },
  });
}

/**
 * パスワードリセットトークンを作成
 */
export async function create(data: {
  token: string;
  userId: string;
  expiresAt: Date;
}) {
  return prisma.passwordResetToken.create({
    data,
  });
}
