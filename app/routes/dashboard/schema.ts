// ライブラリ
import { z } from "zod";

// 在庫サマリースキーマ（DB検証・エンティティ）
export const inventorySummarySchema = z.object({
  totalItems: z.number(),
  totalQuantity: z.number(),
  lowStockCount: z.number(),
  recentInCount: z.number(),
  recentOutCount: z.number(),
});

// 入出庫履歴スキーマ（DB検証・エンティティ）
export const stockMovementSchema = z.object({
  id: z.string(),
  itemName: z.string(),
  type: z.enum(["in", "out"]),
  quantity: z.number(),
  date: z.string(),
});

// 型定義（スキーマから推論）
export type InventorySummary = z.infer<typeof inventorySummarySchema>;
export type StockMovement = z.infer<typeof stockMovementSchema>;
