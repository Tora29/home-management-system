// ライブラリ
import { z } from "zod";

// 共有スキーマ
import {
  passwordConfirmSchema,
  passwordSchema,
} from "~/shared/schema/auth.schema";

// 共有エラーメッセージ
import { AUTH_ERROR_MESSAGES } from "~/shared/errorMessage/auth";

// パスワードリセットの入力スキーマ
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: passwordConfirmSchema,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: AUTH_ERROR_MESSAGES.passwordConfirm.mismatch,
    path: ["passwordConfirm"],
  });

// 型定義
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
