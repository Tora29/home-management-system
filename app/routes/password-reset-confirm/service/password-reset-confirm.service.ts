// 型定義
import type { FieldErrors } from "~/shared/types/result";
import {
  passwordResetTokenSchema,
  passwordResetTokenWithUserSchema,
  resetPasswordSchema,
} from "../schema";

// リポジトリ
import * as passwordResetTokenRepository from "../repository/password-reset-token.repository";

// 共有ライブラリ
import { hashPassword } from "~/shared/lib/password.server";

// エラーメッセージ
import { ERROR_MESSAGES } from "../errorMessage";

// トークン検証結果の型（loader で使用）
export type TokenValidationResult =
  | { success: true; data: { email: string } }
  | { success: false; type: "token"; message: string };

// パスワードリセット結果の型
export type ResetPasswordResult =
  | { success: true; data: null }
  | { success: false; type: "validation"; errors: FieldErrors }
  | { success: false; type: "token"; message: string };

/**
 * トークンの有効性を検証する
 */
export async function validateToken(
  token: string | undefined
): Promise<TokenValidationResult> {
  if (!token) {
    return {
      success: false,
      type: "token",
      message: ERROR_MESSAGES.token.invalid,
    };
  }

  const rawResetToken =
    await passwordResetTokenRepository.findByTokenWithUser(token);

  if (!rawResetToken) {
    return {
      success: false,
      type: "token",
      message: ERROR_MESSAGES.token.invalid,
    };
  }

  // DB から取得したトークンの検証
  const validatedToken =
    passwordResetTokenWithUserSchema.safeParse(rawResetToken);
  if (!validatedToken.success) {
    throw new Error("データ形式が不正です");
  }
  const resetToken = validatedToken.data;

  if (resetToken.usedAt) {
    return {
      success: false,
      type: "token",
      message: ERROR_MESSAGES.token.used,
    };
  }

  if (resetToken.expiresAt < new Date()) {
    return {
      success: false,
      type: "token",
      message: ERROR_MESSAGES.token.expired,
    };
  }

  return { success: true, data: { email: resetToken.user.email } };
}

/**
 * パスワードをリセットする
 */
export async function resetPassword(
  token: string | undefined,
  input: unknown
): Promise<ResetPasswordResult> {
  // バリデーション
  const result = resetPasswordSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      type: "validation",
      errors: result.error.flatten().fieldErrors as FieldErrors,
    };
  }

  // トークンを再度検証（Race Condition対策）
  if (!token) {
    return {
      success: false,
      type: "token",
      message: ERROR_MESSAGES.token.invalid,
    };
  }

  const rawResetToken = await passwordResetTokenRepository.findByToken(token);

  if (!rawResetToken) {
    return {
      success: false,
      type: "token",
      message: ERROR_MESSAGES.token.invalid,
    };
  }

  // DB から取得したトークンの検証
  const validatedToken = passwordResetTokenSchema.safeParse(rawResetToken);
  if (!validatedToken.success) {
    throw new Error("データ形式が不正です");
  }
  const resetToken = validatedToken.data;

  if (resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return {
      success: false,
      type: "token",
      message: ERROR_MESSAGES.token.invalid,
    };
  }

  // パスワードをハッシュ化して保存
  const passwordHash = await hashPassword(result.data.password);

  // トランザクションでパスワード更新とトークン使用済みマークを実行
  await passwordResetTokenRepository.updatePasswordAndMarkTokenUsed(
    resetToken.userId,
    resetToken.id,
    passwordHash
  );

  return { success: true, data: null };
}
