import { z } from 'zod'

import { ITEM_ERROR } from '@/shared/consts/errorMessage'

/**
 * 在庫アイテム作成用のZodスキーマ
 */
export const CreateItemSchema = z.object({
  name: z.string().min(1, ITEM_ERROR.NAME_REQUIRED),
  description: z.string().optional(),
  quantity: z.coerce
    .number({ message: ITEM_ERROR.QUANTITY_REQUIRED })
    .min(0, ITEM_ERROR.QUANTITY_MIN),
  unit: z.string().min(1, ITEM_ERROR.UNIT_REQUIRED),
  location: z.string().min(1, ITEM_ERROR.LOCATION_REQUIRED),
  barcode: z.string().optional(),
  notes: z.string().optional(),
  categoryId: z.string().min(1, ITEM_ERROR.CATEGORY_REQUIRED),
})

/**
 * 在庫アイテム更新用のZodスキーマ
 */
export const UpdateItemSchema = z.object({
  name: z.string().min(1, ITEM_ERROR.NAME_REQUIRED).optional(),
  description: z.string().nullable().optional(),
  quantity: z.coerce.number().min(0, ITEM_ERROR.QUANTITY_MIN).optional(),
  unit: z.string().min(1, ITEM_ERROR.UNIT_REQUIRED).optional(),
  location: z.string().nullable().optional(),
  barcode: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  categoryId: z.string().min(1, ITEM_ERROR.CATEGORY_REQUIRED).optional(),
})

/**
 * 在庫数量更新用のZodスキーマ
 */
export const UpdateQuantitySchema = z.object({
  quantity: z.coerce.number().min(0, ITEM_ERROR.QUANTITY_MIN),
  reason: z.string().min(1, 'Reason is required'),
})

/**
 * 在庫アイテム作成時の入力型
 */
export type CreateItemInput = z.infer<typeof CreateItemSchema>

/**
 * 在庫アイテム更新時の入力型
 */
export type UpdateItemInput = z.infer<typeof UpdateItemSchema>

/**
 * 在庫数量更新時の入力型
 */
export type UpdateQuantityInput = z.infer<typeof UpdateQuantitySchema>
