// ユーザー登録用のリポジトリ（Prisma呼び出しのみ）

// 共有ライブラリ
import { prisma } from "~/shared/lib/db.server";

/**
 * ユーザーを作成
 */
export async function create(data: {
  email: string;
  passwordHash: string;
  name: string | null;
}) {
  return prisma.user.create({
    data,
  });
}
