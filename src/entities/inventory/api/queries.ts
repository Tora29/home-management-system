/**
 * Inventory Entity Data Fetching
 * エンティティ固有のピュアなデータ取得関数
 */

import { itemRepository } from '@/features/inventory/repository/repository'

import type { ItemWithCategory } from '../model'

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
