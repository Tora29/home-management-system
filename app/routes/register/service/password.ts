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
    0: { label: "CRITICAL", color: "bg-[#ff0044]" },
    1: { label: "WEAK", color: "bg-[#ff8800]" },
    2: { label: "MODERATE", color: "bg-[#ffcc00]" },
    3: { label: "STRONG", color: "bg-[#00ff66]" },
    4: { label: "SECURE", color: "bg-[#00f0ff]" },
  };

  return {
    score: normalizedScore,
    ...strengthMap[normalizedScore],
  };
}
