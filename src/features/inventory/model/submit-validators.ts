import { z } from 'zod'

import { ITEM_ERROR } from '@/shared/consts/errorMessage'

/**
 * 在庫アイテム作成用のZodスキーマ
 */
export const createItemSchema = z.object({
  name: z.string().min(1, ITEM_ERROR.NAME_REQUIRED),
  description: z.string().optional(),
  quantity: z.coerce
    .number({ message: ITEM_ERROR.QUANTITY_REQUIRED })
    .min(0, ITEM_ERROR.QUANTITY_MIN),
  unitId: z.string().min(1, ITEM_ERROR.UNIT_REQUIRED),
  locationId: z.string().optional(),
  barcode: z.string().optional(),
  notes: z.string().optional(),
  categoryId: z.string().min(1, ITEM_ERROR.CATEGORY_REQUIRED),
})

/**
 * 在庫アイテム更新用のZodスキーマ
 */
export const updateItemSchema = z.object({
  name: z.string().min(1, ITEM_ERROR.NAME_REQUIRED).optional(),
  description: z.string().nullable().optional(),
  quantity: z.coerce.number().min(0, ITEM_ERROR.QUANTITY_MIN).optional(),
  unitId: z.string().min(1, ITEM_ERROR.UNIT_REQUIRED).optional(),
  locationId: z.string().nullable().optional(),
  barcode: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  categoryId: z.string().min(1, ITEM_ERROR.CATEGORY_REQUIRED).optional(),
})

/**
 * 在庫数量更新用のZodスキーマ
 */
export const updateQuantitySchema = z.object({
  quantity: z.coerce.number().min(0, ITEM_ERROR.QUANTITY_MIN),
  reason: z.string().min(1, 'Reason is required'),
})

/**
 * 在庫アイテム作成時の入力型
 */
export type CreateItemInput = z.infer<typeof createItemSchema>

/**
 * 在庫アイテム更新時の入力型
 */
export type UpdateItemInput = z.infer<typeof updateItemSchema>

/**
 * 在庫数量更新時の入力型
 */
export type UpdateQuantityInput = z.infer<typeof updateQuantitySchema>
