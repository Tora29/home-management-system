// パスワードリセットトークンのリポジトリ（Prisma呼び出しのみ）

// 共有ライブラリ
import { prisma } from "~/shared/lib/db.server";

/**
 * トークンでパスワードリセットトークンを取得（ユーザー情報含む）
 */
export async function findByTokenWithUser(token: string) {
  return prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: { select: { email: true } } },
  });
}

/**
 * トークンでパスワードリセットトークンを取得
 */
export async function findByToken(token: string) {
  return prisma.passwordResetToken.findUnique({
    where: { token },
  });
}

/**
 * トークンの使用済み日時を更新
 */
export async function updateUsedAt(tokenId: string) {
  return prisma.passwordResetToken.update({
    where: { id: tokenId },
    data: { usedAt: new Date() },
  });
}

/**
 * ユーザーのパスワードを更新し、トークンを使用済みにマークする（トランザクション）
 */
export async function updatePasswordAndMarkTokenUsed(
  userId: string,
  tokenId: string,
  passwordHash: string
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    // ユーザーのパスワードを更新
    await tx.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    // トークンを使用済みにマーク
    await tx.passwordResetToken.update({
      where: { id: tokenId },
      data: { usedAt: new Date() },
    });
  });
}
