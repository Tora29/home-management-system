import { describe, it, expect, vi, beforeEach } from 'vitest'

import { prisma } from '@/shared/lib/prisma'

import { itemRepository, itemHistoryRepository } from './submit'

import type { CreateItemInput, UpdateItemInput } from '../model/submit-validators'
import type { Item, ItemHistory, Prisma } from '@prisma/client'

// Prismaクライアントのモック
vi.mock('@/shared/lib/prisma', () => ({
  prisma: {
    item: {
      findUnique: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    itemHistory: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}))

describe('itemRepository', () => {
  const mockItem: Item = {
    id: 'item-1',
    name: 'テストアイテム',
    description: 'テスト用のアイテム',
    quantity: 10,
    unit: '個',
    location: '倉庫A',
    categoryId: 'cat-1',
    barcode: null,
    notes: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }

  const mockItemWithCategory = {
    ...mockItem,
    category: {
      id: 'cat-1',
      name: 'カテゴリー1',
      description: null,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('findById', () => {
    describe('正常系', () => {
      it('IDでアイテムを取得できる', async () => {
        vi.mocked(prisma.item.findUnique).mockResolvedValue(mockItemWithCategory)

        const result = await itemRepository.findById('item-1')

        expect(prisma.item.findUnique).toHaveBeenCalledWith({
          where: { id: 'item-1' },
          include: { category: true },
        })
        expect(result).toEqual(mockItemWithCategory)
      })

      it('トランザクションクライアントを使用できる', async () => {
        const mockTx = {
          item: {
            findUnique: vi.fn().mockResolvedValue(mockItemWithCategory),
          },
        } as unknown as Prisma.TransactionClient

        const result = await itemRepository.findById('item-1', mockTx)

        expect(mockTx.item.findUnique).toHaveBeenCalledWith({
          where: { id: 'item-1' },
          include: { category: true },
        })
        expect(result).toEqual(mockItemWithCategory)
      })

      it('存在しないIDの場合nullを返す', async () => {
        vi.mocked(prisma.item.findUnique).mockResolvedValue(null)

        const result = await itemRepository.findById('non-existent')

        expect(result).toBeNull()
      })
    })

    describe('異常系', () => {
      it('データベースエラーを伝播する', async () => {
        const dbError = new Error('Database connection failed')
        vi.mocked(prisma.item.findUnique).mockRejectedValue(dbError)

        await expect(itemRepository.findById('item-1')).rejects.toThrow(dbError)
      })
    })
  })

  describe('findByName', () => {
    describe('正常系', () => {
      it('名前でアイテムを検索できる', async () => {
        vi.mocked(prisma.item.findFirst).mockResolvedValue(mockItem)

        const result = await itemRepository.findByName('テストアイテム')

        expect(prisma.item.findFirst).toHaveBeenCalledWith({
          where: { name: 'テストアイテム' },
        })
        expect(result).toEqual(mockItem)
      })

      it('存在しない名前の場合nullを返す', async () => {
        vi.mocked(prisma.item.findFirst).mockResolvedValue(null)

        const result = await itemRepository.findByName('存在しないアイテム')

        expect(result).toBeNull()
      })

      it('トランザクションクライアントを使用できる', async () => {
        const mockTx = {
          item: {
            findFirst: vi.fn().mockResolvedValue(mockItem),
          },
        } as unknown as Prisma.TransactionClient

        const result = await itemRepository.findByName('テストアイテム', mockTx)

        expect(mockTx.item.findFirst).toHaveBeenCalledWith({
          where: { name: 'テストアイテム' },
        })
        expect(result).toEqual(mockItem)
      })
    })
  })

  describe('findAll', () => {
    describe('正常系', () => {
      it('全アイテムを新しい順で取得できる', async () => {
        const mockItems = [mockItemWithCategory, { ...mockItemWithCategory, id: 'item-2' }]
        vi.mocked(prisma.item.findMany).mockResolvedValue(mockItems)

        const result = await itemRepository.findAll()

        expect(prisma.item.findMany).toHaveBeenCalledWith({
          include: { category: true },
          orderBy: { createdAt: 'desc' },
        })
        expect(result).toEqual(mockItems)
      })

      it('アイテムが0件の場合空配列を返す', async () => {
        vi.mocked(prisma.item.findMany).mockResolvedValue([])

        const result = await itemRepository.findAll()

        expect(result).toEqual([])
      })

      it('トランザクションクライアントを使用できる', async () => {
        const mockTx = {
          item: {
            findMany: vi.fn().mockResolvedValue([mockItemWithCategory]),
          },
        } as unknown as Prisma.TransactionClient

        const result = await itemRepository.findAll(mockTx)

        expect(mockTx.item.findMany).toHaveBeenCalledWith({
          include: { category: true },
          orderBy: { createdAt: 'desc' },
        })
        expect(result).toEqual([mockItemWithCategory])
      })
    })
  })

  describe('create', () => {
    const createData: CreateItemInput = {
      name: '新規アイテム',
      description: '新規作成のアイテム',
      quantity: 20,
      unit: '個',
      location: '倉庫B',
      categoryId: 'cat-2',
    }

    describe('正常系', () => {
      it('新しいアイテムを作成できる', async () => {
        const createdItem = { ...mockItem, ...createData, id: 'new-item-1' }
        vi.mocked(prisma.item.create).mockResolvedValue(createdItem)

        const result = await itemRepository.create(createData)

        expect(prisma.item.create).toHaveBeenCalledWith({ data: createData })
        expect(result).toEqual(createdItem)
      })

      it('オプション項目がnullでも作成できる', async () => {
        const minimalData: CreateItemInput = {
          name: 'ミニマルアイテム',
          quantity: 1,
          unit: '個',
          location: '倉庫A',
          categoryId: 'cat-1',
        }
        const createdItem = { ...mockItem, ...minimalData }
        vi.mocked(prisma.item.create).mockResolvedValue(createdItem)

        const result = await itemRepository.create(minimalData)

        expect(result).toEqual(createdItem)
      })

      it('トランザクションクライアントを使用できる', async () => {
        const mockTx = {
          item: {
            create: vi.fn().mockResolvedValue(mockItem),
          },
        } as unknown as Prisma.TransactionClient

        const result = await itemRepository.create(createData, mockTx)

        expect(mockTx.item.create).toHaveBeenCalledWith({ data: createData })
        expect(result).toEqual(mockItem)
      })
    })

    describe('異常系', () => {
      it('ユニーク制約違反エラーを伝播する', async () => {
        const uniqueError = new Error('Unique constraint failed on the fields: (`name`)')
        vi.mocked(prisma.item.create).mockRejectedValue(uniqueError)

        await expect(itemRepository.create(createData)).rejects.toThrow(uniqueError)
      })
    })
  })

  describe('update', () => {
    const updateData: UpdateItemInput = {
      name: '更新されたアイテム',
      quantity: 30,
      location: '倉庫C',
    }

    describe('正常系', () => {
      it('アイテムを更新できる', async () => {
        const updatedItem = { ...mockItem, ...updateData }
        vi.mocked(prisma.item.update).mockResolvedValue(updatedItem)

        const result = await itemRepository.update('item-1', updateData)

        expect(prisma.item.update).toHaveBeenCalledWith({
          where: { id: 'item-1' },
          data: updateData,
        })
        expect(result).toEqual(updatedItem)
      })

      it('部分的な更新ができる', async () => {
        const partialUpdate: UpdateItemInput = { quantity: 50 }
        const updatedItem = { ...mockItem, quantity: 50 }
        vi.mocked(prisma.item.update).mockResolvedValue(updatedItem)

        const result = await itemRepository.update('item-1', partialUpdate)

        expect(prisma.item.update).toHaveBeenCalledWith({
          where: { id: 'item-1' },
          data: partialUpdate,
        })
        expect(result.quantity).toBe(50)
      })

      it('トランザクションクライアントを使用できる', async () => {
        const mockTx = {
          item: {
            update: vi.fn().mockResolvedValue(mockItem),
          },
        } as unknown as Prisma.TransactionClient

        const result = await itemRepository.update('item-1', updateData, mockTx)

        expect(mockTx.item.update).toHaveBeenCalledWith({
          where: { id: 'item-1' },
          data: updateData,
        })
        expect(result).toEqual(mockItem)
      })
    })

    describe('異常系', () => {
      it('存在しないアイテムの更新エラーを伝播する', async () => {
        const notFoundError = new Error('Record to update not found')
        vi.mocked(prisma.item.update).mockRejectedValue(notFoundError)

        await expect(itemRepository.update('non-existent', updateData)).rejects.toThrow(
          notFoundError,
        )
      })
    })
  })

  describe('delete', () => {
    describe('正常系', () => {
      it('アイテムを削除できる', async () => {
        vi.mocked(prisma.item.delete).mockResolvedValue(mockItem)

        const result = await itemRepository.delete('item-1')

        expect(prisma.item.delete).toHaveBeenCalledWith({
          where: { id: 'item-1' },
        })
        expect(result).toEqual(mockItem)
      })

      it('トランザクションクライアントを使用できる', async () => {
        const mockTx = {
          item: {
            delete: vi.fn().mockResolvedValue(mockItem),
          },
        } as unknown as Prisma.TransactionClient

        const result = await itemRepository.delete('item-1', mockTx)

        expect(mockTx.item.delete).toHaveBeenCalledWith({
          where: { id: 'item-1' },
        })
        expect(result).toEqual(mockItem)
      })
    })

    describe('異常系', () => {
      it('存在しないアイテムの削除エラーを伝播する', async () => {
        const notFoundError = new Error('Record to delete does not exist')
        vi.mocked(prisma.item.delete).mockRejectedValue(notFoundError)

        await expect(itemRepository.delete('non-existent')).rejects.toThrow(notFoundError)
      })

      it('外部キー制約エラーを伝播する', async () => {
        const foreignKeyError = new Error('Foreign key constraint failed')
        vi.mocked(prisma.item.delete).mockRejectedValue(foreignKeyError)

        await expect(itemRepository.delete('item-1')).rejects.toThrow(foreignKeyError)
      })
    })
  })

  describe('updateQuantity', () => {
    describe('正常系', () => {
      it('在庫数量を更新できる', async () => {
        const now = new Date()
        const updatedItem = { ...mockItem, quantity: 100, updatedAt: now }
        vi.mocked(prisma.item.update).mockResolvedValue(updatedItem)

        const result = await itemRepository.updateQuantity('item-1', 100)

        expect(prisma.item.update).toHaveBeenCalledWith({
          where: { id: 'item-1' },
          data: {
            quantity: 100,
            updatedAt: expect.any(Date) as unknown as Date,
          },
        })
        expect(result.quantity).toBe(100)
      })

      it('在庫数量を0に設定できる', async () => {
        const updatedItem = { ...mockItem, quantity: 0 }
        vi.mocked(prisma.item.update).mockResolvedValue(updatedItem)

        const result = await itemRepository.updateQuantity('item-1', 0)

        expect(result.quantity).toBe(0)
      })

      it('トランザクションクライアントを使用できる', async () => {
        const mockTx = {
          item: {
            update: vi.fn().mockResolvedValue({ ...mockItem, quantity: 50 }),
          },
        } as unknown as Prisma.TransactionClient

        const result = await itemRepository.updateQuantity('item-1', 50, mockTx)

        expect(mockTx.item.update).toHaveBeenCalledWith({
          where: { id: 'item-1' },
          data: {
            quantity: 50,
            updatedAt: expect.any(Date) as unknown as Date,
          },
        })
        expect(result.quantity).toBe(50)
      })
    })

    describe('異常系', () => {
      it('負の在庫数量でエラーを伝播する', async () => {
        const validationError = new Error('Validation error: quantity must be positive')
        vi.mocked(prisma.item.update).mockRejectedValue(validationError)

        await expect(itemRepository.updateQuantity('item-1', -10)).rejects.toThrow(validationError)
      })
    })
  })
})

describe('itemHistoryRepository', () => {
  const mockHistory: ItemHistory = {
    id: 'history-1',
    itemId: 'item-1',
    action: 'CREATED',
    quantity: 10,
    unit: '個',
    beforeValue: null,
    afterValue: 10,
    reason: '初期登録',
    notes: '新規在庫登録',
    createdAt: new Date('2024-01-01'),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('create', () => {
    const historyData = {
      itemId: 'item-1',
      action: 'UPDATED',
      quantity: 5,
      unit: '個',
      beforeValue: 10,
      afterValue: 15,
      reason: '在庫補充',
      notes: '定期補充',
    }

    describe('正常系', () => {
      it('履歴を作成できる', async () => {
        vi.mocked(prisma.itemHistory.create).mockResolvedValue(mockHistory)

        const result = await itemHistoryRepository.create(historyData)

        expect(prisma.itemHistory.create).toHaveBeenCalledWith({ data: historyData })
        expect(result).toEqual(mockHistory)
      })

      it('最小限のデータで履歴を作成できる', async () => {
        const minimalData = {
          itemId: 'item-1',
          action: 'CONSUMED',
          quantity: 3,
          unit: '個',
          afterValue: 7,
        }
        vi.mocked(prisma.itemHistory.create).mockResolvedValue({
          ...mockHistory,
          ...minimalData,
        })

        const result = await itemHistoryRepository.create(minimalData)

        expect(prisma.itemHistory.create).toHaveBeenCalledWith({ data: minimalData })
        expect(result.action).toBe('CONSUMED')
      })

      it('トランザクションクライアントを使用できる', async () => {
        const mockTx = {
          itemHistory: {
            create: vi.fn().mockResolvedValue(mockHistory),
          },
        } as unknown as Prisma.TransactionClient

        const result = await itemHistoryRepository.create(historyData, mockTx)

        expect(mockTx.itemHistory.create).toHaveBeenCalledWith({ data: historyData })
        expect(result).toEqual(mockHistory)
      })
    })

    describe('異常系', () => {
      it('外部キー制約エラーを伝播する', async () => {
        const foreignKeyError = new Error('Foreign key constraint failed on the field: `itemId`')
        vi.mocked(prisma.itemHistory.create).mockRejectedValue(foreignKeyError)

        await expect(itemHistoryRepository.create(historyData)).rejects.toThrow(foreignKeyError)
      })
    })
  })

  describe('findByItemId', () => {
    describe('正常系', () => {
      it('アイテムIDで履歴を取得できる', async () => {
        const histories = [
          mockHistory,
          { ...mockHistory, id: 'history-2', action: 'UPDATED' },
          { ...mockHistory, id: 'history-3', action: 'CONSUMED' },
        ]
        vi.mocked(prisma.itemHistory.findMany).mockResolvedValue(histories)

        const result = await itemHistoryRepository.findByItemId('item-1')

        expect(prisma.itemHistory.findMany).toHaveBeenCalledWith({
          where: { itemId: 'item-1' },
          orderBy: { createdAt: 'desc' },
        })
        expect(result).toEqual(histories)
        expect(result).toHaveLength(3)
      })

      it('履歴が存在しない場合空配列を返す', async () => {
        vi.mocked(prisma.itemHistory.findMany).mockResolvedValue([])

        const result = await itemHistoryRepository.findByItemId('item-999')

        expect(result).toEqual([])
      })

      it('トランザクションクライアントを使用できる', async () => {
        const mockTx = {
          itemHistory: {
            findMany: vi.fn().mockResolvedValue([mockHistory]),
          },
        } as unknown as Prisma.TransactionClient

        const result = await itemHistoryRepository.findByItemId('item-1', mockTx)

        expect(mockTx.itemHistory.findMany).toHaveBeenCalledWith({
          where: { itemId: 'item-1' },
          orderBy: { createdAt: 'desc' },
        })
        expect(result).toEqual([mockHistory])
      })
    })

    describe('異常系', () => {
      it('データベースエラーを伝播する', async () => {
        const dbError = new Error('Database connection failed')
        vi.mocked(prisma.itemHistory.findMany).mockRejectedValue(dbError)

        await expect(itemHistoryRepository.findByItemId('item-1')).rejects.toThrow(dbError)
      })
    })
  })
})
