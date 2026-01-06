// ライブラリ
import { z } from "zod";

// 共有スキーマ
import { emailSchema, passwordSchema } from "~/shared/schema/auth.schema";

// ログイン入力のバリデーションスキーマ
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// 型定義
export type LoginInput = z.infer<typeof loginSchema>;
