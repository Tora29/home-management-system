import { describe, it, expect } from 'vitest'

import type { ItemWithCategory } from './item'

describe('inventory/model/item', () => {
  describe('ItemWithCategory', () => {
    it('必須フィールドを含むオブジェクトを作成できる', () => {
      const item: ItemWithCategory = {
        id: 'item-1',
        name: 'テストアイテム',
        description: null,
        quantity: 10,
        unit: '個',
        location: null,
        barcode: null,
        notes: null,
        categoryId: 'cat-1',
        category: {
          id: 'cat-1',
          name: '食品',
          color: '#FF0000',
        },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      }

      expect(item.id).toBe('item-1')
      expect(item.name).toBe('テストアイテム')
      expect(item.quantity).toBe(10)
      expect(item.category.name).toBe('食品')
    })

    it('オプションフィールドがnullまたはundefinedを許可する', () => {
      const itemWithNulls: ItemWithCategory = {
        id: 'item-2',
        name: '最小アイテム',
        description: null,
        quantity: 1,
        unit: '個',
        location: null,
        barcode: null,
        notes: null,
        categoryId: 'cat-1',
        category: {
          id: 'cat-1',
          name: 'カテゴリ',
          color: null,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      expect(itemWithNulls.description).toBeNull()
      expect(itemWithNulls.location).toBeNull()
      expect(itemWithNulls.barcode).toBeNull()
      expect(itemWithNulls.notes).toBeNull()
      expect(itemWithNulls.category.color).toBeNull()
    })

    it('オプションフィールドに値を設定できる', () => {
      const itemWithOptionals: ItemWithCategory = {
        id: 'item-3',
        name: '詳細アイテム',
        description: '詳細な説明',
        quantity: 5,
        unit: 'kg',
        location: '冷蔵庫',
        barcode: '4901234567890',
        notes: '備考情報',
        categoryId: 'cat-2',
        category: {
          id: 'cat-2',
          name: '調味料',
          color: '#00FF00',
        },
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      }

      expect(itemWithOptionals.description).toBe('詳細な説明')
      expect(itemWithOptionals.location).toBe('冷蔵庫')
      expect(itemWithOptionals.barcode).toBe('4901234567890')
      expect(itemWithOptionals.notes).toBe('備考情報')
    })
  })
})
