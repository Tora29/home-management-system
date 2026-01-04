// 型定義
import type { PasswordStrength } from "../schema";

/**
 * パスワードの強度を計算する
 * @param password パスワード文字列
 * @returns 強度スコア、ラベル、色
 */
export function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, label: "", color: "bg-hig-gray4" };
  }

  let score = 0;

  // 長さチェック
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // 文字種チェック
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  // スコアを0-4に正規化
  const normalizedScore = Math.min(4, Math.floor(score * 0.7));

  const strengthMap: Record<number, { label: string; color: string }> = {
    0: { label: "非常に弱い", color: "bg-hig-red" },
    1: { label: "弱い", color: "bg-hig-orange" },
    2: { label: "普通", color: "bg-hig-yellow" },
    3: { label: "強い", color: "bg-hig-green" },
    4: { label: "非常に強い", color: "bg-hig-green" },
  };

  return {
    score: normalizedScore,
    ...strengthMap[normalizedScore],
  };
}
