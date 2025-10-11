/**
 * 在庫検索用のリポジトリ層
 */

import { prisma } from '@/shared/lib/prisma'

import type { SearchParams } from '../model/search-validators'
import type { ItemWithCategory } from '../model/types'
import type { Prisma } from '@prisma/client'

export const inventorySearchRepository = {
  /**
   * 検索条件に基づいて在庫アイテムを取得
   */
  async searchItems(params: SearchParams): Promise<{
    items: ItemWithCategory[]
    total: number
  }> {
    const { search, categoryId, locationId, page, limit } = params

    // 検索条件の構築
    const where: Prisma.ItemWhereInput = {
      AND: [
        // テキスト検索（商品名、説明、バーコード、備考）
        search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { barcode: { contains: search, mode: 'insensitive' } },
                { notes: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
        // カテゴリフィルタ
        categoryId ? { categoryId } : {},
        // 保管場所フィルタ
        locationId ? { locationId } : {},
      ],
    }

    // 並列でカウントとデータ取得を実行
    const [total, items] = await Promise.all([
      prisma.item.count({ where }),
      prisma.item.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
          unit: {
            select: {
              id: true,
              name: true,
              displayName: true,
            },
          },
          location: {
            select: {
              id: true,
              name: true,
              displayName: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          updatedAt: 'desc',
        },
      }),
    ])

    // アイテムデータを整形（互換性のため、unit、locationフィールドは文字列として残す）
    const itemsWithDisplayNames = items.map((item) => ({
      ...item,
      unit: item.unit.name,
      unitDisplayName: item.unit.displayName,
      location: item.location?.name,
      locationDisplayName: item.location?.displayName,
    }))

    return {
      items: itemsWithDisplayNames as ItemWithCategory[],
      total,
    }
  },

  /**
   * アイテム総数を取得
   */
  async getTotalCount(where: Prisma.ItemWhereInput = {}): Promise<number> {
    return prisma.item.count({ where })
  },
}
