// ライブラリ
import { randomBytes } from "crypto";

// 型定義
import type { FieldErrors } from "~/shared/types/result";
import {
  passwordResetTokenSchema,
  requestResetSchema,
  userSchema,
} from "../schema";

// リポジトリ
import * as passwordResetTokenRepository from "../repository/password-reset-token.repository";
import * as userRepository from "~/shared/repository/user.repository";

// Result 型
export type RequestResetResult =
  | { success: true; data: { resetUrl: string | null } }
  | { success: false; type: "validation"; errors: FieldErrors };

// トークン有効期限（1時間）
const TOKEN_EXPIRY_MS = 60 * 60 * 1000;

// パスワードリセット要求を処理
export async function requestPasswordReset(
  input: unknown,
  baseUrl: string
): Promise<RequestResetResult> {
  // バリデーション
  const result = requestResetSchema.safeParse(input);
  if (!result.success) {
    return {
      success: false,
      type: "validation",
      errors: result.error.flatten().fieldErrors as FieldErrors,
    };
  }

  const { email } = result.data;

  // ユーザーを検索（存在しなくてもセキュリティ上成功を返す）
  const rawUser = await userRepository.findByEmail(email);

  if (!rawUser) {
    // ユーザーが存在しない場合も成功を返す（セキュリティ対策）
    return { success: true, data: { resetUrl: null } };
  }

  // DB から取得したユーザーの検証
  const validatedUser = userSchema.safeParse(rawUser);
  if (!validatedUser.success) {
    throw new Error("データ形式が不正です");
  }
  const user = validatedUser.data;

  // 既存の未使用トークンを無効化
  await passwordResetTokenRepository.removeUnusedByUserId(user.id);

  // 新しいトークンを生成
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS);

  const rawToken = await passwordResetTokenRepository.create({
    token,
    userId: user.id,
    expiresAt,
  });

  // DB から取得したトークンの検証
  const validatedToken = passwordResetTokenSchema.safeParse(rawToken);
  if (!validatedToken.success) {
    throw new Error("データ形式が不正です");
  }

  // リセットURLを生成
  const resetUrl = `${baseUrl}/password-reset/${validatedToken.data.token}`;

  return { success: true, data: { resetUrl } };
}
