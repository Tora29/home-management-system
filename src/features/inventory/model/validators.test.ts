import { describe, it, expect } from 'vitest'

import {
  createItemSchema as CreateItemSchema,
  updateItemSchema as UpdateItemSchema,
  updateQuantitySchema as UpdateQuantitySchema,
} from '@/features/inventory/model/validators'
import { ITEM_ERROR } from '@/shared/consts/errorMessage'

describe('CreateItemSchema', () => {
  describe('有効なデータの場合', () => {
    describe('すべてのフィールドが入力されている時', () => {
      it('検証に成功する', () => {
        const validData = {
          name: 'トイレットペーパー',
          description: '12ロール入り',
          quantity: 10,
          unit: 'pack',
          location: 'storage',
          barcode: '4901234567890',
          notes: '特売時に購入',
          categoryId: 'cat-123',
        }

        const result = CreateItemSchema.safeParse(validData)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual(validData)
        }
      })
    })

    describe('最小限のフィールドのみの時', () => {
      it('検証に成功する', () => {
        const minimalData = {
          name: 'アイテム',
          quantity: 0,
          unit: 'piece',
          location: 'room1',
          categoryId: 'cat-456',
        }

        const result = CreateItemSchema.safeParse(minimalData)
        expect(result.success).toBe(true)
      })
    })

    describe('オプションフィールドがundefinedの時', () => {
      it('適切に処理される', () => {
        const data = {
          name: 'アイテム',
          quantity: 1,
          unit: 'piece',
          location: 'storage',
          categoryId: 'cat-123',
          description: undefined,
          barcode: undefined,
          notes: undefined,
        }

        const result = CreateItemSchema.safeParse(data)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.description).toBeUndefined()
          expect(result.data.barcode).toBeUndefined()
          expect(result.data.notes).toBeUndefined()
        }
      })
    })
  })

  describe('無効なデータの場合', () => {
    describe('必須フィールドが不足している時', () => {
      it('エラーを返す', () => {
        const invalidData = {
          description: 'テスト',
        }

        const result = CreateItemSchema.safeParse(invalidData)
        expect(result.success).toBe(false)
      })
    })

    describe('名前が空の時', () => {
      it('エラーを返す', () => {
        const data = {
          name: '',
          quantity: 1,
          unit: 'piece',
          location: 'storage',
          categoryId: 'cat-123',
        }

        const result = CreateItemSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          const nameError = result.error.issues.find((issue) => issue.path[0] === 'name')
          expect(nameError?.message).toBe(ITEM_ERROR.NAME_REQUIRED)
        }
      })
    })

    describe('数量が負の値の時', () => {
      it('エラーを返す', () => {
        const data = {
          name: 'アイテム',
          quantity: -1,
          unit: 'piece',
          location: 'storage',
          categoryId: 'cat-123',
        }

        const result = CreateItemSchema.safeParse(data)
        expect(result.success).toBe(false)
        if (!result.success) {
          const quantityError = result.error.issues.find((issue) => issue.path[0] === 'quantity')
          expect(quantityError?.message).toBe(ITEM_ERROR.QUANTITY_MIN)
        }
      })
    })
  })

  describe('型変換の場合', () => {
    describe('文字列の数量が提供された時', () => {
      it('数値に変換される', () => {
        const data = {
          name: 'アイテム',
          quantity: '5' as unknown as number,
          unit: 'piece',
          location: 'storage',
          categoryId: 'cat-123',
        }

        const result = CreateItemSchema.safeParse(data)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.quantity).toBe(5)
          expect(typeof result.data.quantity).toBe('number')
        }
      })
    })
  })
})

describe('UpdateItemSchema', () => {
  describe('有効なデータの場合', () => {
    describe('部分的な更新データの時', () => {
      it('検証に成功する', () => {
        const updateData = {
          name: '新しい名前',
          quantity: 20,
        }

        const result = UpdateItemSchema.safeParse(updateData)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual(updateData)
        }
      })
    })

    describe('空のオブジェクトの時', () => {
      it('検証に成功する', () => {
        const emptyUpdate = {}

        const result = UpdateItemSchema.safeParse(emptyUpdate)
        expect(result.success).toBe(true)
      })
    })

    describe('nullableフィールドにnullが設定された時', () => {
      it('nullを許可する', () => {
        const updateData = {
          description: null,
          location: null,
          barcode: null,
          notes: null,
        }

        const result = UpdateItemSchema.safeParse(updateData)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.description).toBeNull()
          expect(result.data.location).toBeNull()
          expect(result.data.barcode).toBeNull()
          expect(result.data.notes).toBeNull()
        }
      })
    })
  })

  describe('無効なデータの場合', () => {
    describe('数量が負の値の時', () => {
      it('エラーを返す', () => {
        const updateData = {
          quantity: -5,
        }

        const result = UpdateItemSchema.safeParse(updateData)
        expect(result.success).toBe(false)
        if (!result.success) {
          const quantityError = result.error.issues.find((issue) => issue.path[0] === 'quantity')
          expect(quantityError?.message).toBe(ITEM_ERROR.QUANTITY_MIN)
        }
      })
    })

    describe('必須文字列フィールドが空の時', () => {
      it('エラーを返す', () => {
        const updateData = {
          name: '',
          unit: '',
          categoryId: '',
        }

        const result = UpdateItemSchema.safeParse(updateData)
        expect(result.success).toBe(false)
        if (!result.success) {
          const nameError = result.error.issues.find((issue) => issue.path[0] === 'name')
          const unitError = result.error.issues.find((issue) => issue.path[0] === 'unit')
          const categoryError = result.error.issues.find((issue) => issue.path[0] === 'categoryId')

          expect(nameError?.message).toBe(ITEM_ERROR.NAME_REQUIRED)
          expect(unitError?.message).toBe(ITEM_ERROR.UNIT_REQUIRED)
          expect(categoryError?.message).toBe(ITEM_ERROR.CATEGORY_REQUIRED)
        }
      })
    })
  })
})

describe('UpdateQuantitySchema', () => {
  describe('有効なデータの場合', () => {
    describe('数量と理由が正しく提供された時', () => {
      it('検証に成功する', () => {
        const updateData = {
          quantity: 100,
          reason: '在庫補充',
        }

        const result = UpdateQuantitySchema.safeParse(updateData)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data).toEqual(updateData)
        }
      })
    })

    describe('数量が0の時', () => {
      it('検証に成功する', () => {
        const updateData = {
          quantity: 0,
          reason: '在庫切れ',
        }

        const result = UpdateQuantitySchema.safeParse(updateData)
        expect(result.success).toBe(true)
      })
    })
  })

  describe('無効なデータの場合', () => {
    describe('数量が負の値の時', () => {
      it('エラーを返す', () => {
        const updateData = {
          quantity: -10,
          reason: 'テスト',
        }

        const result = UpdateQuantitySchema.safeParse(updateData)
        expect(result.success).toBe(false)
        if (!result.success) {
          const quantityError = result.error.issues.find((issue) => issue.path[0] === 'quantity')
          expect(quantityError?.message).toBe(ITEM_ERROR.QUANTITY_MIN)
        }
      })
    })

    describe('理由が空の時', () => {
      it('エラーを返す', () => {
        const updateData = {
          quantity: 10,
          reason: '',
        }

        const result = UpdateQuantitySchema.safeParse(updateData)
        expect(result.success).toBe(false)
        if (!result.success) {
          const reasonError = result.error.issues.find((issue) => issue.path[0] === 'reason')
          expect(reasonError?.message).toBe('Reason is required')
        }
      })
    })

    describe('理由が不足している時', () => {
      it('エラーを返す', () => {
        const updateData = {
          quantity: 10,
        }

        const result = UpdateQuantitySchema.safeParse(updateData)
        expect(result.success).toBe(false)
      })
    })
  })

  describe('型変換の場合', () => {
    describe('文字列の数量が提供された時', () => {
      it('数値に変換される', () => {
        const updateData = {
          quantity: '50' as unknown as number,
          reason: '調整',
        }

        const result = UpdateQuantitySchema.safeParse(updateData)
        expect(result.success).toBe(true)
        if (result.success) {
          expect(result.data.quantity).toBe(50)
          expect(typeof result.data.quantity).toBe('number')
        }
      })
    })
  })
})
