import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { prisma } from '@/shared/lib/prisma'

import { itemRepository, itemHistoryRepository } from '../repository/repository'

import { createInventoryItem, updateInventoryQuantity } from './create-item'

import type { CreateItemInput } from '../model/validators'
import type { Item, Prisma, ItemHistory, Category } from '@prisma/client'

vi.mock('@/shared/lib/prisma', () => ({
  prisma: {
    $transaction: vi.fn(),
  },
}))

vi.mock('../repository/repository', () => ({
  itemRepository: {
    findByName: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
    updateQuantity: vi.fn(),
  },
  itemHistoryRepository: {
    create: vi.fn(),
  },
}))

const mockedPrismaTransaction = vi.mocked(prisma.$transaction)
const mockedItemRepository = vi.mocked(itemRepository)
const mockedItemHistoryRepository = vi.mocked(itemHistoryRepository)

describe('createInventoryItem', () => {
  const mockItem: Item = {
    id: 'item-id-1',
    name: 'テスト商品',
    description: 'テスト説明',
    quantity: 10,
    unit: '個',
    location: '倉庫A',
    barcode: '1234567890',
    notes: 'テストノート',
    categoryId: 'category-1',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  }

  const validInput: CreateItemInput = {
    name: 'テスト商品',
    description: 'テスト説明',
    quantity: 10,
    unit: '個',
    location: '倉庫A',
    barcode: '1234567890',
    notes: 'テストノート',
    categoryId: 'category-1',
  }

  beforeEach(() => {
    vi.clearAllMocks()

    // トランザクション実行のモック
    mockedPrismaTransaction.mockImplementation(async (callback) => {
      const mockTx = {} as Prisma.TransactionClient
      return callback(mockTx)
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('正常系', () => {
    it('新規アイテムが正常に作成される', async () => {
      mockedItemRepository.findByName.mockResolvedValueOnce(null)
      mockedItemRepository.create.mockResolvedValueOnce(mockItem)
      mockedItemHistoryRepository.create.mockResolvedValueOnce({} as ItemHistory)

      const result = await createInventoryItem(validInput)

      expect(result).toEqual(mockItem)
      expect(mockedItemRepository.findByName).toHaveBeenCalledWith('テスト商品', {})
      expect(mockedItemRepository.create).toHaveBeenCalledWith(validInput, {})
      expect(mockedItemHistoryRepository.create).toHaveBeenCalledWith(
        {
          itemId: 'item-id-1',
          action: 'ADD',
          quantity: 10,
          unit: '個',
          afterValue: 10,
          reason: 'Initial creation',
        },
        {},
      )
    })

    it('quantity未指定の場合は0がデフォルト値として設定される', async () => {
      const inputWithoutQuantity = {
        ...validInput,
        quantity: undefined,
      } as CreateItemInput & { quantity: undefined }

      const itemWithZeroQuantity = {
        ...mockItem,
        quantity: 0,
      }

      mockedItemRepository.findByName.mockResolvedValueOnce(null)
      mockedItemRepository.create.mockResolvedValueOnce(itemWithZeroQuantity)
      mockedItemHistoryRepository.create.mockResolvedValueOnce({} as ItemHistory)

      const result = await createInventoryItem(inputWithoutQuantity)

      expect(result.quantity).toBe(0)
      expect(mockedItemRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ quantity: 0 }),
        {},
      )
      expect(mockedItemHistoryRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          quantity: 0,
          afterValue: 0,
        }),
        {},
      )
    })

    it('userIdが渡された場合は正しく処理される', async () => {
      const inputWithUserId = {
        ...validInput,
        userId: 'user-123',
      }

      mockedItemRepository.findByName.mockResolvedValueOnce(null)
      mockedItemRepository.create.mockResolvedValueOnce(mockItem)
      mockedItemHistoryRepository.create.mockResolvedValueOnce({} as ItemHistory)

      const result = await createInventoryItem(inputWithUserId)

      expect(result).toEqual(mockItem)
      expect(mockedItemRepository.create).toHaveBeenCalledWith(inputWithUserId, {})
    })
  })

  describe('異常系', () => {
    it('同名のアイテムが既に存在する場合はエラーが投げられる', async () => {
      mockedItemRepository.findByName.mockResolvedValueOnce(mockItem)

      await expect(createInventoryItem(validInput)).rejects.toThrow(
        'Item with name "テスト商品" already exists',
      )

      expect(mockedItemRepository.findByName).toHaveBeenCalledWith('テスト商品', {})
      expect(mockedItemRepository.create).not.toHaveBeenCalled()
      expect(mockedItemHistoryRepository.create).not.toHaveBeenCalled()
    })

    it('アイテム作成時にエラーが発生した場合はトランザクションがロールバックされる', async () => {
      const createError = new Error('Database error')
      mockedItemRepository.findByName.mockResolvedValueOnce(null)
      mockedItemRepository.create.mockRejectedValueOnce(createError)

      await expect(createInventoryItem(validInput)).rejects.toThrow('Database error')

      expect(mockedItemRepository.create).toHaveBeenCalled()
      expect(mockedItemHistoryRepository.create).not.toHaveBeenCalled()
    })

    it('履歴作成時にエラーが発生した場合はトランザクションがロールバックされる', async () => {
      const historyError = new Error('History creation failed')
      mockedItemRepository.findByName.mockResolvedValueOnce(null)
      mockedItemRepository.create.mockResolvedValueOnce(mockItem)
      mockedItemHistoryRepository.create.mockRejectedValueOnce(historyError)

      await expect(createInventoryItem(validInput)).rejects.toThrow('History creation failed')

      expect(mockedItemRepository.create).toHaveBeenCalled()
      expect(mockedItemHistoryRepository.create).toHaveBeenCalled()
    })
  })

  describe('トランザクション管理', () => {
    it('全ての操作が同一トランザクション内で実行される', async () => {
      const mockTx = { mockTransaction: true } as unknown as Prisma.TransactionClient

      mockedPrismaTransaction.mockImplementationOnce(async (callback) => {
        return callback(mockTx)
      })

      mockedItemRepository.findByName.mockResolvedValueOnce(null)
      mockedItemRepository.create.mockResolvedValueOnce(mockItem)
      mockedItemHistoryRepository.create.mockResolvedValueOnce({} as ItemHistory)

      await createInventoryItem(validInput)

      expect(mockedItemRepository.findByName).toHaveBeenCalledWith('テスト商品', mockTx)
      expect(mockedItemRepository.create).toHaveBeenCalledWith(validInput, mockTx)
      expect(mockedItemHistoryRepository.create).toHaveBeenCalledWith(expect.any(Object), mockTx)
    })
  })
})

describe('updateInventoryQuantity', () => {
  const mockItem: Item = {
    id: 'item-id-1',
    name: 'テスト商品',
    description: 'テスト説明',
    quantity: 10,
    unit: '個',
    location: '倉庫A',
    barcode: '1234567890',
    notes: 'テストノート',
    categoryId: 'category-1',
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  }

  const mockCategory: Category = {
    id: 'category-1',
    name: 'テストカテゴリー',
    description: 'テストカテゴリーの説明',
    icon: '📦',
    color: '#000000',
    sortOrder: 1,
    isActive: true,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-01'),
  }

  const mockItemWithCategory = {
    ...mockItem,
    category: mockCategory,
  }

  beforeEach(() => {
    vi.clearAllMocks()

    mockedPrismaTransaction.mockImplementation(async (callback) => {
      const mockTx = {} as Prisma.TransactionClient
      return callback(mockTx)
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('正常系', () => {
    it('在庫数量が正常に更新される', async () => {
      const updatedItem = { ...mockItem, quantity: 20 }

      mockedItemRepository.findById.mockResolvedValueOnce(mockItemWithCategory)
      mockedItemRepository.updateQuantity.mockResolvedValueOnce(updatedItem)
      mockedItemHistoryRepository.create.mockResolvedValueOnce({} as ItemHistory)

      const result = await updateInventoryQuantity('item-id-1', 20, '在庫補充')

      expect(result).toEqual(updatedItem)
      expect(mockedItemRepository.findById).toHaveBeenCalledWith('item-id-1', {})
      expect(mockedItemRepository.updateQuantity).toHaveBeenCalledWith('item-id-1', 20, {})
      expect(mockedItemHistoryRepository.create).toHaveBeenCalledWith(
        {
          itemId: 'item-id-1',
          action: 'UPDATE',
          quantity: 10, // 20 - 10
          unit: '個',
          beforeValue: 10,
          afterValue: 20,
          reason: '在庫補充',
        },
        {},
      )
    })

    it('在庫数量が減少する更新も正常に処理される', async () => {
      const updatedItem = { ...mockItem, quantity: 5 }

      mockedItemRepository.findById.mockResolvedValueOnce(mockItemWithCategory)
      mockedItemRepository.updateQuantity.mockResolvedValueOnce(updatedItem)
      mockedItemHistoryRepository.create.mockResolvedValueOnce({} as ItemHistory)

      const result = await updateInventoryQuantity('item-id-1', 5, '在庫使用')

      expect(result).toEqual(updatedItem)
      expect(mockedItemHistoryRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          quantity: -5, // 5 - 10
          beforeValue: 10,
          afterValue: 5,
          reason: '在庫使用',
        }),
        {},
      )
    })

    it('在庫数量を0に更新できる', async () => {
      const updatedItem = { ...mockItem, quantity: 0 }

      mockedItemRepository.findById.mockResolvedValueOnce(mockItemWithCategory)
      mockedItemRepository.updateQuantity.mockResolvedValueOnce(updatedItem)
      mockedItemHistoryRepository.create.mockResolvedValueOnce({} as ItemHistory)

      const result = await updateInventoryQuantity('item-id-1', 0, '在庫切れ')

      expect(result).toEqual(updatedItem)
      expect(mockedItemRepository.updateQuantity).toHaveBeenCalledWith('item-id-1', 0, {})
      expect(mockedItemHistoryRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          quantity: -10,
          beforeValue: 10,
          afterValue: 0,
          reason: '在庫切れ',
        }),
        {},
      )
    })
  })

  describe('異常系', () => {
    it('存在しないアイテムIDの場合はエラーが投げられる', async () => {
      mockedItemRepository.findById.mockResolvedValueOnce(null)

      await expect(updateInventoryQuantity('invalid-id', 20, '更新理由')).rejects.toThrow(
        'Item not found',
      )

      expect(mockedItemRepository.findById).toHaveBeenCalledWith('invalid-id', {})
      expect(mockedItemRepository.updateQuantity).not.toHaveBeenCalled()
      expect(mockedItemHistoryRepository.create).not.toHaveBeenCalled()
    })

    it('負の数量を設定しようとするとエラーが投げられる', async () => {
      mockedItemRepository.findById.mockResolvedValueOnce(mockItemWithCategory)

      await expect(updateInventoryQuantity('item-id-1', -5, '不正な更新')).rejects.toThrow(
        'Quantity cannot be negative',
      )

      expect(mockedItemRepository.findById).toHaveBeenCalledWith('item-id-1', {})
      expect(mockedItemRepository.updateQuantity).not.toHaveBeenCalled()
      expect(mockedItemHistoryRepository.create).not.toHaveBeenCalled()
    })

    it('更新時にエラーが発生した場合はトランザクションがロールバックされる', async () => {
      const updateError = new Error('Update failed')
      mockedItemRepository.findById.mockResolvedValueOnce(mockItemWithCategory)
      mockedItemRepository.updateQuantity.mockRejectedValueOnce(updateError)

      await expect(updateInventoryQuantity('item-id-1', 20, '更新理由')).rejects.toThrow(
        'Update failed',
      )

      expect(mockedItemRepository.updateQuantity).toHaveBeenCalled()
      expect(mockedItemHistoryRepository.create).not.toHaveBeenCalled()
    })

    it('履歴作成時にエラーが発生した場合はトランザクションがロールバックされる', async () => {
      const historyError = new Error('History creation failed')
      const updatedItem = { ...mockItem, quantity: 20 }

      mockedItemRepository.findById.mockResolvedValueOnce(mockItemWithCategory)
      mockedItemRepository.updateQuantity.mockResolvedValueOnce(updatedItem)
      mockedItemHistoryRepository.create.mockRejectedValueOnce(historyError)

      await expect(updateInventoryQuantity('item-id-1', 20, '更新理由')).rejects.toThrow(
        'History creation failed',
      )

      expect(mockedItemRepository.updateQuantity).toHaveBeenCalled()
      expect(mockedItemHistoryRepository.create).toHaveBeenCalled()
    })
  })

  describe('トランザクション管理', () => {
    it('全ての操作が同一トランザクション内で実行される', async () => {
      const mockTx = { mockTransaction: true } as unknown as Prisma.TransactionClient
      const updatedItem = { ...mockItem, quantity: 20 }

      mockedPrismaTransaction.mockImplementationOnce(async (callback) => {
        return callback(mockTx)
      })

      mockedItemRepository.findById.mockResolvedValueOnce(mockItemWithCategory)
      mockedItemRepository.updateQuantity.mockResolvedValueOnce(updatedItem)
      mockedItemHistoryRepository.create.mockResolvedValueOnce({} as ItemHistory)

      await updateInventoryQuantity('item-id-1', 20, '在庫補充')

      expect(mockedItemRepository.findById).toHaveBeenCalledWith('item-id-1', mockTx)
      expect(mockedItemRepository.updateQuantity).toHaveBeenCalledWith('item-id-1', 20, mockTx)
      expect(mockedItemHistoryRepository.create).toHaveBeenCalledWith(expect.any(Object), mockTx)
    })
  })

  describe('エッジケース', () => {
    it('数量変更がない場合でも履歴は記録される', async () => {
      const unchangedItem = { ...mockItem }

      mockedItemRepository.findById.mockResolvedValueOnce(mockItemWithCategory)
      mockedItemRepository.updateQuantity.mockResolvedValueOnce(unchangedItem)
      mockedItemHistoryRepository.create.mockResolvedValueOnce({} as ItemHistory)

      const result = await updateInventoryQuantity('item-id-1', 10, '同数量への更新')

      expect(result).toEqual(unchangedItem)
      expect(mockedItemHistoryRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          quantity: 0, // 10 - 10
          beforeValue: 10,
          afterValue: 10,
          reason: '同数量への更新',
        }),
        {},
      )
    })

    it('非常に大きな数量でも正常に処理される', async () => {
      const largeQuantity = 999999999
      const updatedItem = { ...mockItem, quantity: largeQuantity }

      mockedItemRepository.findById.mockResolvedValueOnce(mockItemWithCategory)
      mockedItemRepository.updateQuantity.mockResolvedValueOnce(updatedItem)
      mockedItemHistoryRepository.create.mockResolvedValueOnce({} as ItemHistory)

      const result = await updateInventoryQuantity('item-id-1', largeQuantity, '大量在庫')

      expect(result.quantity).toBe(largeQuantity)
      expect(mockedItemRepository.updateQuantity).toHaveBeenCalledWith(
        'item-id-1',
        largeQuantity,
        {},
      )
    })
  })
})
