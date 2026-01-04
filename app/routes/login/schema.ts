// ライブラリ
import { z } from "zod";

// 共有スキーマ
import { emailSchema, passwordSchema } from "~/shared/schema/auth.schema";

// DB検証用スキーマを再エクスポート
export { userSchema, type User } from "~/shared/schema/user.schema";

// ログイン入力のバリデーションスキーマ
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// 型定義
export type LoginInput = z.infer<typeof loginSchema>;
