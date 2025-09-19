/**
 * 在庫アイテムの型定義
 * Prismaから生成される型を再エクスポート
 */
export type { Item, ItemHistory } from '@prisma/client'

/**
 * 在庫アイテムの表示用インターフェース
 */
export interface ItemWithCategory {
  id: string
  name: string
  description?: string | null
  quantity: number
  unit: string
  location?: string | null
  barcode?: string | null
  notes?: string | null
  categoryId: string
  category: {
    id: string
    name: string
    color?: string | null
  }
  createdAt: Date
  updatedAt: Date
}
