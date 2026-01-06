// 在庫サービス
// ビジネスロジックを実装する
// TODO: Prisma スキーマ作成後、repository 経由で DB から取得する

// ライブラリ
import { z } from "zod";

// 型定義
import {
  inventorySummarySchema,
  stockMovementSchema,
  type InventorySummary,
  type StockMovement,
} from "../schema";

// モックデータ（Prisma スキーマ作成後は repository に移動）
const mockSummary: InventorySummary = {
  totalItems: 247,
  totalQuantity: 1892,
  lowStockCount: 12,
  recentInCount: 34,
  recentOutCount: 18,
};

const mockMovements: StockMovement[] = [
  { id: "1", itemName: "洗剤", type: "in", quantity: 10, date: "2024-01-05" },
  {
    id: "2",
    itemName: "トイレットペーパー",
    type: "out",
    quantity: 5,
    date: "2024-01-05",
  },
  {
    id: "3",
    itemName: "キッチンペーパー",
    type: "in",
    quantity: 12,
    date: "2024-01-04",
  },
  { id: "4", itemName: "石鹸", type: "out", quantity: 3, date: "2024-01-04" },
  {
    id: "5",
    itemName: "シャンプー",
    type: "in",
    quantity: 6,
    date: "2024-01-03",
  },
  {
    id: "6",
    itemName: "歯磨き粉",
    type: "out",
    quantity: 2,
    date: "2024-01-03",
  },
];

/**
 * 在庫サマリーを取得する
 * TODO: Prisma スキーマ作成後、repository 経由で取得する
 * @returns 在庫サマリー
 * @throws Error データ形式が不正な場合
 */
export function getInventorySummary(): InventorySummary {
  // TODO: const summary = await inventoryRepository.findSummary();
  const summary = mockSummary;

  // データの検証（失敗は予期しないエラー）
  const result = inventorySummarySchema.safeParse(summary);
  if (!result.success) {
    throw new Error("在庫サマリーのデータ形式が不正です");
  }

  return result.data;
}

/**
 * 直近の入出庫履歴を取得する
 * TODO: Prisma スキーマ作成後、repository 経由で取得する
 * @returns 入出庫履歴の配列
 * @throws Error データ形式が不正な場合
 */
export function getRecentMovements(): StockMovement[] {
  // TODO: const movements = await inventoryRepository.findRecentMovements();
  const movements = mockMovements;

  // データの検証（失敗は予期しないエラー）
  const result = z.array(stockMovementSchema).safeParse(movements);
  if (!result.success) {
    throw new Error("入出庫履歴のデータ形式が不正です");
  }

  return result.data;
}
