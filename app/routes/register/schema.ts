// ライブラリ
import { z } from "zod";

// 共有スキーマ
import {
  emailSchema,
  passwordConfirmSchema,
  passwordSchema,
} from "~/shared/schema/auth.schema";

// 共有エラーメッセージ
import { AUTH_ERROR_MESSAGES } from "~/shared/errorMessage/auth";

// ローカルエラーメッセージ
import { ERROR_MESSAGES } from "./errorMessage";

// DB検証用スキーマを再エクスポート
export { userSchema, type User } from "~/shared/schema/user.schema";

// パスワード強度スキーマ
export const passwordStrengthSchema = z.object({
  score: z.number().min(0).max(4),
  label: z.string(),
  color: z.string(),
});

// パスワード強度の型
export type PasswordStrength = z.infer<typeof passwordStrengthSchema>;

// ユーザー登録用バリデーションスキーマ
export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    passwordConfirm: passwordConfirmSchema,
    name: z.string().max(50, ERROR_MESSAGES.name.maxLength).optional(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: AUTH_ERROR_MESSAGES.passwordConfirm.mismatch,
    path: ["passwordConfirm"],
  });

// 登録入力の型
export type RegisterInput = z.infer<typeof registerSchema>;
