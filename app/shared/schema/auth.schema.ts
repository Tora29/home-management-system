import { z } from "zod";

import { AUTH_ERROR_MESSAGES } from "../errorMessage/auth";

// メールアドレスのベーススキーマ
export const emailSchema = z
  .string()
  .min(1, AUTH_ERROR_MESSAGES.email.required)
  .email(AUTH_ERROR_MESSAGES.email.invalid);

// パスワードのベーススキーマ
export const passwordSchema = z
  .string()
  .min(1, AUTH_ERROR_MESSAGES.password.required)
  .min(8, AUTH_ERROR_MESSAGES.password.minLength);

// パスワード確認のベーススキーマ
export const passwordConfirmSchema = z
  .string()
  .min(1, AUTH_ERROR_MESSAGES.passwordConfirm.required);

/**
 * パスワード確認付きオブジェクトを作成するヘルパー
 * 使用例:
 * const schema = z.object({ ... }).and(createPasswordWithConfirmSchema());
 */
export function createPasswordWithConfirmSchema() {
  return z
    .object({
      password: passwordSchema,
      passwordConfirm: passwordConfirmSchema,
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: AUTH_ERROR_MESSAGES.passwordConfirm.mismatch,
      path: ["passwordConfirm"],
    });
}
