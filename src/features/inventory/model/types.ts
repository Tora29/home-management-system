/**
 * 在庫機能のビジネスロジック用型定義
 * Prismaの型生成機能を活用
 * @see https://www.prisma.io/docs/orm/prisma-client/type-safety/operating-against-partial-structures-of-model-types
 */

import type { Prisma } from '@prisma/client'

/**
 * カテゴリ、単位、保管場所を含む在庫アイテムの基本型
 * Prismaクエリ結果の型を型安全に生成
 */
export type ItemWithRelations = Prisma.ItemGetPayload<{
  include: {
    category: true
    unit: true
    location: true
  }
}>

/**
 * 表示用に拡張された在庫アイテム型
 * repository/search.tsで整形されたデータ構造
 */
export interface ItemWithCategory extends ItemWithRelations {
  // 互換性のための追加フィールド
  unitDisplayName: string
  locationDisplayName?: string
}

/**
 * 在庫アイテムリストの検索結果型
 */
export interface SearchItemsResult {
  items: ItemWithCategory[]
  total: number
}

/**
 * ページネーション付き検索結果型
 */
export interface PaginatedItemsResult extends SearchItemsResult {
  currentPage: number
  totalPages: number
}
