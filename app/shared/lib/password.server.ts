// パスワードハッシュ化ユーティリティ
// サーバーサイドでのみ使用する

import bcrypt from "bcrypt";

// ソルトラウンド数（推奨値: 10-12）
const SALT_ROUNDS = 10;

/**
 * パスワードをハッシュ化する
 * @param password プレーンテキストのパスワード
 * @returns ハッシュ化されたパスワード
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * パスワードを検証する
 * @param password プレーンテキストのパスワード
 * @param hash ハッシュ化されたパスワード
 * @returns パスワードが一致すれば true
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
