// 共有ユーザーリポジトリ（Prisma呼び出しのみ）
// 複数ルートで共通して使用する User テーブルアクセス

// 共有ライブラリ
import { prisma } from "~/shared/lib/db.server";

/**
 * メールアドレスでユーザーを検索する
 */
export async function findByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}
