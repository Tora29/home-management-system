// 認証サービス
// ビジネスロジックを実装し、Repository を呼び出す

// ライブラリ
import { z } from "zod";

// 型定義
import type { FieldErrors } from "~/shared/types/result";
import { loginSchema, userSchema, type User } from "../schema";

// 共有リポジトリ
import { findByEmail } from "~/shared/repository/user.repository";

// 共有ライブラリ
import { verifyPassword } from "~/shared/lib/password.server";

// エラーメッセージ
import { ERROR_MESSAGES } from "../errorMessage";

// Result 型
export type LoginResult =
  | { success: true; data: { user: User } }
  | { success: false; type: "validation"; errors: FieldErrors }
  | { success: false; type: "auth"; message: string };

/**
 * ログイン処理を実行する
 * @param input ログイン入力（email, password）
 * @returns ログイン結果
 */
export async function login(input: unknown): Promise<LoginResult> {
  // 入力のバリデーション
  const result = loginSchema.safeParse(input);
  if (!result.success) {
    const flattened = z.flattenError(result.error);
    return {
      success: false,
      type: "validation",
      errors: flattened.fieldErrors as FieldErrors,
    };
  }

  const { email, password } = result.data;

  // ユーザーを検索
  const user = await findByEmail(email);
  if (!user) {
    return {
      success: false,
      type: "auth",
      message: ERROR_MESSAGES.auth.invalidCredentials,
    };
  }

  // パスワードの検証
  const isPasswordValid = await verifyPassword(password, user.passwordHash);
  if (!isPasswordValid) {
    return {
      success: false,
      type: "auth",
      message: ERROR_MESSAGES.auth.invalidCredentials,
    };
  }

  // DB から取得したユーザーの検証
  const validatedUser = userSchema.safeParse(user);
  if (!validatedUser.success) {
    throw new Error("データ形式が不正です");
  }

  return {
    success: true,
    data: { user: validatedUser.data },
  };
}
