/**
 * 在庫検索・フィルタリング用のバリデータ
 */

import { z } from 'zod'

/**
 * 在庫検索パラメータのスキーマ
 */
export const searchParamsSchema = z.object({
  search: z.string().optional(),
  categoryId: z.string().optional(),
  locationId: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
})

/**
 * 在庫検索パラメータの型定義
 */
export type SearchParams = z.infer<typeof searchParamsSchema>

/**
 * 検索結果のレスポンススキーマ
 */
export const searchResponseSchema = z.object({
  items: z.array(z.any()), // ItemWithCategory型をanyで受け入れ
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
})

/**
 * 検索結果レスポンスの型定義
 */
export type SearchResponse = z.infer<typeof searchResponseSchema>
