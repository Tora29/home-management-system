import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  createItemAction,
  processFormData,
  validateItemData,
  saveItem,
  recordItemHistory,
} from './actions'
import { ITEM_ERROR } from '@/shared/consts/errorMessage'
import { ZodError } from 'zod'

// Prismaのモック
vi.mock('@/shared/lib/prisma', () => ({
  prisma: {
    item: {
      create: vi.fn(),
    },
    itemHistory: {
      create: vi.fn(),
    },
  },
}))

// Next.js関数のモック
vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn((path) => {
    throw new Error(`NEXT_REDIRECT: ${path}`)
  }),
}))

vi.mock('next/dist/client/components/redirect-error', () => ({
  isRedirectError: vi.fn((error) => {
    return error?.message?.startsWith('NEXT_REDIRECT')
  }),
}))

import { prisma } from '@/shared/lib/prisma'

describe('processFormData', () => {
  describe('FormDataが提供された時', () => {
    it('オブジェクトに変換する', () => {
      const formData = new FormData()
      formData.append('name', 'テストアイテム')
      formData.append('quantity', '10')
      formData.append('unit', 'pack')
      formData.append('location', 'storage')
      formData.append('categoryId', 'cat-123')

      const result = processFormData(formData)

      expect(result).toEqual({
        name: 'テストアイテム',
        description: undefined,
        quantity: '10',
        unit: 'pack',
        location: 'storage',
        barcode: undefined,
        notes: undefined,
        categoryId: 'cat-123',
      })
    })
  })

  describe('空の値が含まれる時', () => {
    it('undefinedまたは空文字列として処理する', () => {
      const formData = new FormData()
      formData.append('name', '')
      formData.append('description', '')
      formData.append('quantity', '0')
      formData.append('unit', '')
      formData.append('location', '')
      formData.append('categoryId', '')

      const result = processFormData(formData)

      expect(result.name).toBe('')
      expect(result.description).toBeUndefined()
      expect(result.quantity).toBe('0')
      expect(result.unit).toBe('')
      expect(result.location).toBe('')
      expect(result.barcode).toBeUndefined()
      expect(result.notes).toBeUndefined()
      expect(result.categoryId).toBe('')
    })
  })
})

describe('validateItemData', () => {
  describe('有効なデータの場合', () => {
    it('検証に成功する', () => {
      const data = {
        name: 'テストアイテム',
        description: '説明',
        quantity: '10',
        unit: 'pack',
        location: 'storage',
        barcode: '1234567890',
        notes: 'メモ',
        categoryId: 'cat-123',
      }

      const result = validateItemData(data)

      expect(result.name).toBe('テストアイテム')
      expect(result.quantity).toBe(10) // 数値に変換される
      expect(result.unit).toBe('pack')
    })
  })

  describe('無効なデータの場合', () => {
    it('ZodErrorをスローする', () => {
      const data = {
        name: '',
        description: undefined,
        quantity: '-5',
        unit: '',
        location: '',
        barcode: undefined,
        notes: undefined,
        categoryId: '',
      }

      expect(() => validateItemData(data)).toThrow(ZodError)
    })
  })

  describe('数値変換の場合', () => {
    it('文字列の数量を数値に変換する', () => {
      const data = {
        name: 'アイテム',
        quantity: '25',
        unit: 'piece',
        location: 'storage',
        categoryId: 'cat-123',
      }

      const result = validateItemData(data)

      expect(result.quantity).toBe(25)
      expect(typeof result.quantity).toBe('number')
    })
  })
})

describe('saveItem', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('有効なデータが提供された時', () => {
    it('データベースに保存する', async () => {
      const validatedData = {
        name: 'テストアイテム',
        description: '説明',
        quantity: 10,
        unit: 'pack',
        location: 'storage',
        barcode: '1234567890',
        notes: 'メモ',
        categoryId: 'cat-123',
      }

      const mockItem = {
        id: 'item-123',
        ...validatedData,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      vi.mocked(prisma.item.create).mockResolvedValue(mockItem)

      const result = await saveItem(validatedData)

      expect(prisma.item.create).toHaveBeenCalledWith({
        data: validatedData,
      })
      expect(result).toEqual(mockItem)
    })
  })

  describe('データベースエラーの場合', () => {
    it('エラーをスローする', async () => {
      const validatedData = {
        name: 'テストアイテム',
        quantity: 10,
        unit: 'pack',
        location: 'storage',
        categoryId: 'cat-123',
      }

      vi.mocked(prisma.item.create).mockRejectedValue(new Error('DB Error'))

      await expect(saveItem(validatedData)).rejects.toThrow('DB Error')
    })
  })
})

describe('recordItemHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('アイテムが提供された時', () => {
    it('履歴を記録する', async () => {
      const item = {
        id: 'item-123',
        name: 'テストアイテム',
        description: '説明',
        quantity: 10,
        unit: 'pack',
        location: 'storage',
        barcode: '1234567890',
        notes: 'メモ',
        categoryId: 'cat-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const mockHistory = {
        id: 'history-123',
        itemId: item.id,
        action: 'ADD',
        quantity: item.quantity,
        unit: item.unit,
        afterValue: item.quantity,
        reason: 'Initial registration',
        createdAt: new Date(),
      }

      vi.mocked(prisma.itemHistory.create).mockResolvedValue(mockHistory as any)

      const result = await recordItemHistory(item)

      expect(prisma.itemHistory.create).toHaveBeenCalledWith({
        data: {
          itemId: 'item-123',
          action: 'ADD',
          quantity: 10,
          unit: 'pack',
          afterValue: 10,
          reason: 'Initial registration',
        },
      })
      expect(result).toEqual(mockHistory)
    })
  })
})

describe('createItemAction（統合テスト）', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('バリデーションエラーの場合', () => {
    it('エラーを返す', async () => {
      const formData = new FormData()
      formData.append('name', '')
      formData.append('quantity', '-5')

      const result = await createItemAction(null, formData)

      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(prisma.item.create).not.toHaveBeenCalled()
    })
  })

  describe('データベースエラーの場合', () => {
    it('一般的なエラーメッセージを返す', async () => {
      const formData = new FormData()
      formData.append('name', 'テストアイテム')
      formData.append('quantity', '10')
      formData.append('unit', 'pack')
      formData.append('location', 'storage')
      formData.append('categoryId', 'cat-123')

      vi.mocked(prisma.item.create).mockRejectedValue(new Error('DB Error'))

      const result = await createItemAction(null, formData)

      expect(result.success).toBe(false)
      expect(result.error).toBe(ITEM_ERROR.CREATE_FAILED)
    })
  })
})
