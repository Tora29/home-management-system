import { revalidatePath } from 'next/cache'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { redirect } from 'next/navigation'

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { ITEM_ERROR } from '@/shared/consts/errorMessage'

import { createInventoryItem } from '../service/create-item'

import { createItemAction } from './actions'

import type { Item } from '@prisma/client'

// 型安全なモック設定
vi.mock('../service/create-item')
vi.mock('next/navigation')
vi.mock('next/cache')
vi.mock('next/dist/client/components/redirect-error', () => ({
  isRedirectError: vi.fn(),
}))

// Next.js のリダイレクトエラーの型定義
interface RedirectError extends Error {
  digest: string
}

// モック化された関数の型定義
const mockedCreateInventoryItem = vi.mocked(createInventoryItem)
const mockedRedirect = vi.mocked(redirect)
const mockedIsRedirectError = vi.mocked(isRedirectError)

describe('createItemAction', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('正常系', () => {
    it('有効なデータで正常にアイテムが作成される', async () => {
      // 準備
      const formData = new FormData()
      formData.append('name', 'テストアイテム')
      formData.append('description', 'テスト説明')
      formData.append('quantity', '10')
      formData.append('unit', '個')
      formData.append('location', '倉庫A')
      formData.append('barcode', '1234567890')
      formData.append('notes', 'テストメモ')
      formData.append('categoryId', 'category-1')

      const mockRedirectError: RedirectError = Object.assign(new Error('NEXT_REDIRECT'), {
        digest: 'NEXT_REDIRECT',
      })

      const mockItem: Partial<Item> = {
        id: 'test-item-id',
        name: 'テストアイテム',
      }

      mockedCreateInventoryItem.mockResolvedValueOnce(mockItem as Item)
      mockedRedirect.mockImplementation(() => {
        throw mockRedirectError
      })
      mockedIsRedirectError.mockImplementation((error): error is RedirectError => {
        return error instanceof Error && 'digest' in error && error.digest === 'NEXT_REDIRECT'
      })

      // 実行 & 検証
      await expect(createItemAction(null, formData)).rejects.toThrow(mockRedirectError)

      // 確認
      expect(createInventoryItem).toHaveBeenCalledWith({
        name: 'テストアイテム',
        description: 'テスト説明',
        quantity: 10,
        unit: '個',
        location: '倉庫A',
        barcode: '1234567890',
        notes: 'テストメモ',
        categoryId: 'category-1',
      })

      expect(revalidatePath).toHaveBeenCalledWith('/inventory')
      expect(revalidatePath).toHaveBeenCalledWith('/inventory/register')
      expect(redirect).toHaveBeenCalledWith('/inventory')
    })

    it('オプション項目なしでアイテムが作成される', async () => {
      // 準備
      const formData = new FormData()
      formData.append('name', 'シンプルアイテム')
      formData.append('quantity', '5')
      formData.append('unit', '個')
      formData.append('location', '倉庫B')
      formData.append('categoryId', 'category-2')

      const mockRedirectError: RedirectError = Object.assign(new Error('NEXT_REDIRECT'), {
        digest: 'NEXT_REDIRECT',
      })

      const mockItem: Partial<Item> = {
        id: 'test-item-id',
        name: 'シンプルアイテム',
      }

      mockedCreateInventoryItem.mockResolvedValueOnce(mockItem as Item)
      mockedRedirect.mockImplementation(() => {
        throw mockRedirectError
      })
      mockedIsRedirectError.mockImplementation((error): error is RedirectError => {
        return error instanceof Error && 'digest' in error && error.digest === 'NEXT_REDIRECT'
      })

      // 実行 & 検証
      await expect(createItemAction(null, formData)).rejects.toThrow(mockRedirectError)

      // 確認
      expect(createInventoryItem).toHaveBeenCalledWith({
        name: 'シンプルアイテム',
        description: undefined,
        quantity: 5,
        unit: '個',
        location: '倉庫B',
        barcode: undefined,
        notes: undefined,
        categoryId: 'category-2',
      })
    })
  })

  describe('異常系 - バリデーションエラー', () => {
    it('必須項目が不足している場合、エラーを返す', async () => {
      // 準備
      const formData = new FormData()
      formData.append('name', '')
      formData.append('quantity', '10')

      // 実行
      const result = await createItemAction(null, formData)

      // 検証
      expect(result).toEqual({
        success: false,
        errors: expect.objectContaining({
          name: expect.stringMatching(/./) as unknown,
          unit: expect.stringMatching(/./) as unknown,
          location: expect.stringMatching(/./) as unknown,
          categoryId: expect.stringMatching(/./) as unknown,
        }) as Record<string, string>,
      })
      expect(createInventoryItem).not.toHaveBeenCalled()
    })

    it('無効な数量で検証エラーを返す', async () => {
      // 準備
      const formData = new FormData()
      formData.append('name', 'テストアイテム')
      formData.append('quantity', '-1')
      formData.append('unit', '個')
      formData.append('location', '倉庫A')
      formData.append('categoryId', 'category-1')

      // 実行
      const result = await createItemAction(null, formData)

      // 検証
      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      if (result.errors) {
        expect(result.errors.quantity).toBeDefined()
      }
      expect(createInventoryItem).not.toHaveBeenCalled()
    })

    it('不正な数値形式で検証エラーを返す', async () => {
      // 準備
      const formData = new FormData()
      formData.append('name', 'テストアイテム')
      formData.append('quantity', 'abc')
      formData.append('unit', '個')
      formData.append('location', '倉庫A')
      formData.append('categoryId', 'category-1')

      // 実行
      const result = await createItemAction(null, formData)

      // 検証
      expect(result).toEqual({
        success: false,
        errors: expect.objectContaining({
          quantity: expect.stringMatching(/./) as unknown,
        }) as Record<string, string>,
      })
      expect(createInventoryItem).not.toHaveBeenCalled()
    })
  })

  describe('異常系 - サービスエラー', () => {
    it('サービス層でエラーが発生した場合、エラーメッセージを返す', async () => {
      // 準備
      const formData = new FormData()
      formData.append('name', 'テストアイテム')
      formData.append('quantity', '10')
      formData.append('unit', '個')
      formData.append('location', '倉庫A')
      formData.append('categoryId', 'category-1')

      const serviceError = new Error('データベース接続エラー')
      mockedCreateInventoryItem.mockRejectedValueOnce(serviceError)
      mockedIsRedirectError.mockReturnValue(false)

      // 実行
      const result = await createItemAction(null, formData)

      // 検証
      expect(result).toEqual({
        success: false,
        error: 'データベース接続エラー',
      })
      expect(createInventoryItem).toHaveBeenCalled()
      expect(redirect).not.toHaveBeenCalled()
    })

    it('予期しないエラーの場合、デフォルトエラーメッセージを返す', async () => {
      // 準備
      const formData = new FormData()
      formData.append('name', 'テストアイテム')
      formData.append('quantity', '10')
      formData.append('unit', '個')
      formData.append('location', '倉庫A')
      formData.append('categoryId', 'category-1')

      mockedCreateInventoryItem.mockRejectedValueOnce('予期しないエラー')
      mockedIsRedirectError.mockReturnValue(false)

      // 実行
      const result = await createItemAction(null, formData)

      // 検証
      expect(result).toEqual({
        success: false,
        error: ITEM_ERROR.CREATE_FAILED,
      })
      expect(createInventoryItem).toHaveBeenCalled()
      expect(redirect).not.toHaveBeenCalled()
    })
  })

  describe('エッジケース', () => {
    it('空のFormDataで適切なエラーを返す', async () => {
      // 準備
      const formData = new FormData()

      // 実行
      const result = await createItemAction(null, formData)

      // 検証
      expect(result).toEqual({
        success: false,
        errors: expect.objectContaining({
          name: expect.stringMatching(/./) as unknown,
          unit: expect.stringMatching(/./) as unknown,
          location: expect.stringMatching(/./) as unknown,
          categoryId: expect.stringMatching(/./) as unknown,
        }) as Record<string, string>,
      })
    })

    it('数量が0の場合も正常に処理される', async () => {
      // 準備
      const formData = new FormData()
      formData.append('name', 'ゼロ在庫アイテム')
      formData.append('quantity', '0')
      formData.append('unit', '個')
      formData.append('location', '倉庫A')
      formData.append('categoryId', 'category-1')

      const mockRedirectError: RedirectError = Object.assign(new Error('NEXT_REDIRECT'), {
        digest: 'NEXT_REDIRECT',
      })

      const mockItem: Partial<Item> = {
        id: 'test-item-id',
        name: 'ゼロ在庫アイテム',
      }

      mockedCreateInventoryItem.mockResolvedValueOnce(mockItem as Item)
      mockedRedirect.mockImplementation(() => {
        throw mockRedirectError
      })
      mockedIsRedirectError.mockImplementation((error): error is RedirectError => {
        return error instanceof Error && 'digest' in error && error.digest === 'NEXT_REDIRECT'
      })

      // 実行 & 検証
      await expect(createItemAction(null, formData)).rejects.toThrow(mockRedirectError)

      // 確認
      expect(createInventoryItem).toHaveBeenCalledWith({
        name: 'ゼロ在庫アイテム',
        quantity: 0,
        unit: '個',
        location: '倉庫A',
        categoryId: 'category-1',
        description: undefined,
        barcode: undefined,
        notes: undefined,
      })
    })

    it('prevStateがある場合でも正常に動作する', async () => {
      // 準備
      const prevState = { success: false, error: '前回のエラー' }
      const formData = new FormData()
      formData.append('name', 'テストアイテム')
      formData.append('quantity', '10')
      formData.append('unit', '個')
      formData.append('location', '倉庫A')
      formData.append('categoryId', 'category-1')

      const mockRedirectError: RedirectError = Object.assign(new Error('NEXT_REDIRECT'), {
        digest: 'NEXT_REDIRECT',
      })

      const mockItem: Partial<Item> = {
        id: 'test-item-id',
        name: 'テストアイテム',
      }

      mockedCreateInventoryItem.mockResolvedValueOnce(mockItem as Item)
      mockedRedirect.mockImplementation(() => {
        throw mockRedirectError
      })
      mockedIsRedirectError.mockImplementation((error): error is RedirectError => {
        return error instanceof Error && 'digest' in error && error.digest === 'NEXT_REDIRECT'
      })

      // 実行 & 検証
      await expect(createItemAction(prevState, formData)).rejects.toThrow(mockRedirectError)

      // 確認
      expect(createInventoryItem).toHaveBeenCalled()
    })
  })
})
