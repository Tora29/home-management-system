/**
 * Inventory Entity Queries Tests
 * エンティティクエリ関数のテスト（A1レベル）
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'

import { itemRepository } from '@/features/inventory/repository/submit'

import { getInventoryItemById, getInventoryItems } from './queries'

import type { ItemWithCategory } from '../model'

// itemRepositoryをモック
vi.mock('@/features/inventory/repository/repository', () => ({
  itemRepository: {
    findById: vi.fn(),
    findAll: vi.fn(),
  },
}))

describe('entities/inventory/api/queries', () => {
  // テストデータ
  const mockCategory = {
    id: 'cat-1',
    name: '食品',
    color: '#FF5733',
  }

  const mockItem1: ItemWithCategory = {
    id: 'item-1',
    name: 'テスト商品1',
    description: 'テスト用の商品説明',
    quantity: 10,
    unit: '個',
    location: '冷蔵庫',
    barcode: '1234567890',
    notes: 'メモ',
    categoryId: 'cat-1',
    category: mockCategory,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  }

  const mockItem2: ItemWithCategory = {
    id: 'item-2',
    name: 'テスト商品2',
    description: null,
    quantity: 5,
    unit: 'kg',
    location: null,
    barcode: null,
    notes: null,
    categoryId: 'cat-1',
    category: mockCategory,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getInventoryItems', () => {
    describe('正常系', () => {
      it('全てのアイテムを取得できる', async () => {
        // Arrange
        const mockItems = [mockItem1, mockItem2]
        vi.mocked(itemRepository.findAll).mockResolvedValue(mockItems)

        // Act
        const result = await getInventoryItems()

        // Assert
        expect(result).toEqual(mockItems)
        expect(itemRepository.findAll).toHaveBeenCalledTimes(1)
        expect(itemRepository.findAll).toHaveBeenCalledWith()
      })

      it('空の配列を返す（アイテムが存在しない場合）', async () => {
        // Arrange
        vi.mocked(itemRepository.findAll).mockResolvedValue([])

        // Act
        const result = await getInventoryItems()

        // Assert
        expect(result).toEqual([])
        expect(itemRepository.findAll).toHaveBeenCalledTimes(1)
      })

      it('1件のアイテムを取得できる', async () => {
        // Arrange
        vi.mocked(itemRepository.findAll).mockResolvedValue([mockItem1])

        // Act
        const result = await getInventoryItems()

        // Assert
        expect(result).toEqual([mockItem1])
        expect(result).toHaveLength(1)
      })
    })

    describe('異常系', () => {
      it('リポジトリがエラーをスローした場合、エラーが伝播する', async () => {
        // Arrange
        const error = new Error('Database connection failed')
        vi.mocked(itemRepository.findAll).mockRejectedValue(error)

        // Act & Assert
        await expect(getInventoryItems()).rejects.toThrow('Database connection failed')
        expect(itemRepository.findAll).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('getInventoryItemById', () => {
    describe('正常系', () => {
      it('指定されたIDのアイテムを取得できる', async () => {
        // Arrange
        const targetId = 'item-1'
        vi.mocked(itemRepository.findById).mockResolvedValue(mockItem1)

        // Act
        const result = await getInventoryItemById(targetId)

        // Assert
        expect(result).toEqual(mockItem1)
        expect(itemRepository.findById).toHaveBeenCalledTimes(1)
        expect(itemRepository.findById).toHaveBeenCalledWith(targetId)
      })

      it('存在しないIDの場合nullを返す', async () => {
        // Arrange
        const nonExistentId = 'non-existent'
        vi.mocked(itemRepository.findById).mockResolvedValue(null)

        // Act
        const result = await getInventoryItemById(nonExistentId)

        // Assert
        expect(result).toBeNull()
        expect(itemRepository.findById).toHaveBeenCalledTimes(1)
        expect(itemRepository.findById).toHaveBeenCalledWith(nonExistentId)
      })

      it('空文字のIDでも処理が実行される', async () => {
        // Arrange
        vi.mocked(itemRepository.findById).mockResolvedValue(null)

        // Act
        const result = await getInventoryItemById('')

        // Assert
        expect(result).toBeNull()
        expect(itemRepository.findById).toHaveBeenCalledWith('')
      })
    })

    describe('異常系', () => {
      it('リポジトリがエラーをスローした場合、エラーが伝播する', async () => {
        // Arrange
        const targetId = 'item-1'
        const error = new Error('Database error')
        vi.mocked(itemRepository.findById).mockRejectedValue(error)

        // Act & Assert
        await expect(getInventoryItemById(targetId)).rejects.toThrow('Database error')
        expect(itemRepository.findById).toHaveBeenCalledTimes(1)
        expect(itemRepository.findById).toHaveBeenCalledWith(targetId)
      })

      it('ネットワークエラーが発生した場合', async () => {
        // Arrange
        const targetId = 'item-1'
        const error = new Error('Network timeout')
        vi.mocked(itemRepository.findById).mockRejectedValue(error)

        // Act & Assert
        await expect(getInventoryItemById(targetId)).rejects.toThrow('Network timeout')
      })
    })

    describe('エッジケース', () => {
      it('特殊文字を含むIDでも正常に処理される', async () => {
        // Arrange
        const specialId = 'item-!@#$%^&*()'
        vi.mocked(itemRepository.findById).mockResolvedValue(null)

        // Act
        const result = await getInventoryItemById(specialId)

        // Assert
        expect(result).toBeNull()
        expect(itemRepository.findById).toHaveBeenCalledWith(specialId)
      })

      it('非常に長いIDでも正常に処理される', async () => {
        // Arrange
        const longId = 'a'.repeat(1000)
        vi.mocked(itemRepository.findById).mockResolvedValue(null)

        // Act
        const result = await getInventoryItemById(longId)

        // Assert
        expect(result).toBeNull()
        expect(itemRepository.findById).toHaveBeenCalledWith(longId)
      })
    })
  })

  describe('型の整合性', () => {
    it('ItemWithCategoryの型が正しく保持される', async () => {
      // Arrange
      vi.mocked(itemRepository.findAll).mockResolvedValue([mockItem1])

      // Act
      const result = await getInventoryItems()

      // Assert
      expect(result[0]).toHaveProperty('id')
      expect(result[0]).toHaveProperty('name')
      expect(result[0]).toHaveProperty('category')
      expect(result[0].category).toHaveProperty('id')
      expect(result[0].category).toHaveProperty('name')
    })

    it('nullableフィールドが正しく処理される', async () => {
      // Arrange
      vi.mocked(itemRepository.findById).mockResolvedValue(mockItem2)

      // Act
      const result = await getInventoryItemById('item-2')

      // Assert
      expect(result).not.toBeNull()
      expect(result?.description).toBeNull()
      expect(result?.location).toBeNull()
      expect(result?.barcode).toBeNull()
      expect(result?.notes).toBeNull()
    })
  })
})
