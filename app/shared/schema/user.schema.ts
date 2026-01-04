// ライブラリ
import { z } from "zod";

// User エンティティスキーマ（DB検証用）
export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  passwordHash: z.string(),
  name: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// 型定義
export type User = z.infer<typeof userSchema>;
