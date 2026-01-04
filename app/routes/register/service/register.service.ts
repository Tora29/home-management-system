// ライブラリ
import { z } from "zod";

// 型定義
import type { FieldErrors } from "~/shared/types/result";
import { registerSchema, userSchema } from "../schema";

// ローカルリポジトリ
import * as userRepository from "../repository/user.repository";

// 共有リポジトリ
import { findByEmail } from "~/shared/repository/user.repository";

// 共有ライブラリ
import { hashPassword } from "~/shared/lib/password.server";

// エラーメッセージ
import { ERROR_MESSAGES } from "../errorMessage";

// 登録結果の型
export type RegisterResult =
  | { success: true; data: { userId: string } }
  | { success: false; type: "validation"; errors: FieldErrors }
  | { success: false; type: "duplicate"; errors: FieldErrors };

/**
 * ユーザー登録を実行する
 * @param input フォームから取得した入力値
 * @returns 登録結果（成功時はユーザーID、失敗時はエラー情報）
 */
export async function registerUser(input: {
  email: unknown;
  password: unknown;
  passwordConfirm: unknown;
  name: unknown;
}): Promise<RegisterResult> {
  // バリデーション
  const result = registerSchema.safeParse({
    email: input.email,
    password: input.password,
    passwordConfirm: input.passwordConfirm,
    name: input.name || undefined,
  });

  if (!result.success) {
    const flattened = z.flattenError(result.error);
    return {
      success: false,
      type: "validation",
      errors: flattened.fieldErrors as FieldErrors,
    };
  }

  const { email, password, name } = result.data;

  // メールアドレスの重複チェック
  const existingUser = await findByEmail(email);

  if (existingUser) {
    return {
      success: false,
      type: "duplicate",
      errors: { email: [ERROR_MESSAGES.email.duplicate] },
    };
  }

  // パスワードをハッシュ化
  const passwordHash = await hashPassword(password);

  // ユーザーを作成
  const rawUser = await userRepository.create({
    email,
    passwordHash,
    name: name || null,
  });

  // DB から取得したユーザーの検証
  const validatedUser = userSchema.safeParse(rawUser);
  if (!validatedUser.success) {
    throw new Error("データ形式が不正です");
  }

  return {
    success: true,
    data: { userId: validatedUser.data.id },
  };
}
