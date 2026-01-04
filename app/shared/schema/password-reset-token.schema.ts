// ライブラリ
import { z } from "zod";

// パスワードリセットトークンスキーマ（基本形）
export const passwordResetTokenSchema = z.object({
  id: z.string(),
  token: z.string(),
  userId: z.string(),
  expiresAt: z.date(),
  usedAt: z.date().nullable(),
  createdAt: z.date(),
});

// パスワードリセットトークンスキーマ（ユーザー情報含む）
// findByTokenWithUser で使用
export const passwordResetTokenWithUserSchema = passwordResetTokenSchema.extend(
  {
    user: z.object({
      email: z.string(),
    }),
  }
);

// 型定義
export type PasswordResetToken = z.infer<typeof passwordResetTokenSchema>;
export type PasswordResetTokenWithUser = z.infer<
  typeof passwordResetTokenWithUserSchema
>;
