import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

import { prisma } from '@/shared/lib/prisma'

import { getMasterData } from './queries'

import type { Category, Unit, Location } from '@prisma/client'

// Prismaクライアントのモック
vi.mock('@/shared/lib/prisma', () => ({
  prisma: {
    category: {
      findMany: vi.fn(),
    },
    unit: {
      findMany: vi.fn(),
    },
    location: {
      findMany: vi.fn(),
    },
  },
}))

// モック化された関数の型定義
const mockedCategoryFindMany = vi.mocked(prisma.category.findMany)
const mockedUnitFindMany = vi.mocked(prisma.unit.findMany)
const mockedLocationFindMany = vi.mocked(prisma.location.findMany)

describe('getMasterData', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('正常系', () => {
    it('全てのマスターデータを正常に取得できる', async () => {
      // 準備
      const mockCategories: Partial<Category>[] = [
        {
          id: '1',
          name: '食料品',
          isActive: true,
          sortOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: '日用品',
          isActive: true,
          sortOrder: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      const mockUnits: Partial<Unit>[] = [
        {
          id: '1',
          name: '個',
          displayName: '個',
          isActive: true,
          sortOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'kg',
          displayName: 'kg',
          isActive: true,
          sortOrder: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      const mockLocations: Partial<Location>[] = [
        {
          id: '1',
          name: '倉庫A',
          description: null,
          isActive: true,
          sortOrder: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: '倉庫B',
          description: null,
          isActive: true,
          sortOrder: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      mockedCategoryFindMany.mockResolvedValueOnce(mockCategories as Category[])
      mockedUnitFindMany.mockResolvedValueOnce(mockUnits as Unit[])
      mockedLocationFindMany.mockResolvedValueOnce(mockLocations as Location[])

      // 実行
      const result = await getMasterData()

      // 検証
      expect(result).toEqual({
        categories: mockCategories,
        units: mockUnits,
        locations: mockLocations,
      })

      // クエリパラメータの確認
      expect(prisma.category.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      })
      expect(prisma.unit.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      })
      expect(prisma.location.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      })
    })

    it('空の結果でも正常に動作する', async () => {
      // 準備
      mockedCategoryFindMany.mockResolvedValueOnce([])
      mockedUnitFindMany.mockResolvedValueOnce([])
      mockedLocationFindMany.mockResolvedValueOnce([])

      // 実行
      const result = await getMasterData()

      // 検証
      expect(result).toEqual({
        categories: [],
        units: [],
        locations: [],
      })

      // すべてのクエリが呼び出されたことを確認
      expect(prisma.category.findMany).toHaveBeenCalledTimes(1)
      expect(prisma.unit.findMany).toHaveBeenCalledTimes(1)
      expect(prisma.location.findMany).toHaveBeenCalledTimes(1)
    })

    it('並列処理で全てのクエリが実行される', async () => {
      // 準備
      const mockCategory: Partial<Category> = {
        id: '1',
        name: 'カテゴリ1',
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const mockUnit: Partial<Unit> = {
        id: '1',
        name: '単位1',
        displayName: '単位1',
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const mockLocation: Partial<Location> = {
        id: '1',
        name: '場所1',
        description: null,
        isActive: true,
        sortOrder: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const categoryPromise = new Promise<Category[]>((resolve) =>
        setTimeout(() => resolve([mockCategory as Category]), 100),
      )
      const unitPromise = new Promise<Unit[]>((resolve) =>
        setTimeout(() => resolve([mockUnit as Unit]), 50),
      )
      const locationPromise = new Promise<Location[]>((resolve) =>
        setTimeout(() => resolve([mockLocation as Location]), 75),
      )

      // @ts-expect-error PrismaPromiseの型の互換性の問題を回避
      mockedCategoryFindMany.mockImplementation(() => categoryPromise)
      // @ts-expect-error PrismaPromiseの型の互換性の問題を回避
      mockedUnitFindMany.mockImplementation(() => unitPromise)
      // @ts-expect-error PrismaPromiseの型の互換性の問題を回避
      mockedLocationFindMany.mockImplementation(() => locationPromise)

      // 実行
      const startTime = Date.now()
      const result = await getMasterData()
      const endTime = Date.now()

      // 検証
      // 並列処理なので、最も遅いクエリ（100ms）程度で完了するはず
      expect(endTime - startTime).toBeLessThan(150)
      expect(result.categories).toEqual([mockCategory])
      expect(result.units).toEqual([mockUnit])
      expect(result.locations).toEqual([mockLocation])
    })
  })

  describe('異常系', () => {
    it('カテゴリ取得でエラーが発生した場合、エラーを投げる', async () => {
      // 準備
      const dbError = new Error('データベース接続エラー')
      mockedCategoryFindMany.mockRejectedValueOnce(dbError)
      mockedUnitFindMany.mockResolvedValueOnce([])
      mockedLocationFindMany.mockResolvedValueOnce([])

      // 実行 & 検証
      await expect(getMasterData()).rejects.toThrow('データベース接続エラー')
    })

    it('単位取得でエラーが発生した場合、エラーを投げる', async () => {
      // 準備
      const dbError = new Error('単位テーブルエラー')
      mockedCategoryFindMany.mockResolvedValueOnce([])
      mockedUnitFindMany.mockRejectedValueOnce(dbError)
      mockedLocationFindMany.mockResolvedValueOnce([])

      // 実行 & 検証
      await expect(getMasterData()).rejects.toThrow('単位テーブルエラー')
    })

    it('場所取得でエラーが発生した場合、エラーを投げる', async () => {
      // 準備
      const dbError = new Error('場所テーブルエラー')
      mockedCategoryFindMany.mockResolvedValueOnce([])
      mockedUnitFindMany.mockResolvedValueOnce([])
      mockedLocationFindMany.mockRejectedValueOnce(dbError)

      // 実行 & 検証
      await expect(getMasterData()).rejects.toThrow('場所テーブルエラー')
    })

    it('複数のクエリでエラーが発生した場合、最初のエラーを投げる', async () => {
      // 準備
      const categoryError = new Error('カテゴリエラー')
      const unitError = new Error('単位エラー')

      mockedCategoryFindMany.mockRejectedValueOnce(categoryError)
      mockedUnitFindMany.mockRejectedValueOnce(unitError)
      mockedLocationFindMany.mockResolvedValueOnce([])

      // 実行 & 検証
      // Promise.allは最初に拒否されたPromiseのエラーを投げる
      await expect(getMasterData()).rejects.toThrow()
    })
  })

  describe('パフォーマンステスト', () => {
    it('クエリが並列に実行されることを確認', async () => {
      // 準備
      const callOrder: string[] = []

      // @ts-expect-error PrismaPromiseの型の互換性の問題を回避
      mockedCategoryFindMany.mockImplementation(() => {
        callOrder.push('category-start')
        return new Promise<Category[]>((resolve) => {
          setTimeout(() => {
            callOrder.push('category-end')
            resolve([])
          }, 10)
        })
      })

      // @ts-expect-error PrismaPromiseの型の互換性の問題を回避
      mockedUnitFindMany.mockImplementation(() => {
        callOrder.push('unit-start')
        return new Promise<Unit[]>((resolve) => {
          setTimeout(() => {
            callOrder.push('unit-end')
            resolve([])
          }, 10)
        })
      })

      // @ts-expect-error PrismaPromiseの型の互換性の問題を回避
      mockedLocationFindMany.mockImplementation(() => {
        callOrder.push('location-start')
        return new Promise<Location[]>((resolve) => {
          setTimeout(() => {
            callOrder.push('location-end')
            resolve([])
          }, 10)
        })
      })

      // 実行
      await getMasterData()

      // 検証
      // 全てのクエリが開始されてから、全てが終了することを確認
      const startCalls = callOrder.filter((call) => call.includes('start'))
      const endCalls = callOrder.filter((call) => call.includes('end'))

      expect(startCalls).toHaveLength(3)
      expect(endCalls).toHaveLength(3)

      // すべてのstartが、最初のendよりも前に来ることを確認（並列実行の証明）
      const firstEndIndex = callOrder.findIndex((call) => call.includes('end'))
      const lastStartIndex = callOrder
        .map((call, index) => (call.includes('start') ? index : -1))
        .filter((index) => index !== -1)
        .pop()

      if (lastStartIndex !== undefined) {
        expect(lastStartIndex).toBeLessThan(firstEndIndex)
      }
    })
  })
})
