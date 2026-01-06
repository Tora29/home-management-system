// ライブラリ
import { z } from "zod";

// 共有スキーマ
import { emailSchema } from "~/shared/schema/auth.schema";

// フォーム入力スキーマ（パスワードリセット要求）
export const requestResetSchema = z.object({
  email: emailSchema,
});

// 型定義
export type RequestResetInput = z.infer<typeof requestResetSchema>;
