/**
 * Inventory Entity Data Fetching
 * エンティティ固有のピュアなデータ取得関数
 */

import { itemRepository } from '@/features/inventory/repository/submit'
import { prisma } from '@/shared/lib/prisma'

import type { Category, Unit, Location } from '../model'
import type { ItemWithCategory } from '@/features/inventory/model/types'

/**
 * 全在庫アイテムを取得
 */
export async function getInventoryItems(): Promise<ItemWithCategory[]> {
  const items = await itemRepository.findAll()
  return items as ItemWithCategory[]
}

/**
 * 在庫アイテムをIDで取得
 */
export async function getInventoryItemById(id: string): Promise<ItemWithCategory | null> {
  const item = await itemRepository.findById(id)
  return item as ItemWithCategory | null
}

/**
 * カテゴリ一覧を取得
 */
export async function getCategories(): Promise<Category[]> {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })
}

/**
 * 単位一覧を取得
 */
export async function getUnits(): Promise<Unit[]> {
  return prisma.unit.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })
}

/**
 * 保管場所一覧を取得
 */
export async function getLocations(): Promise<Location[]> {
  return prisma.location.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })
}
