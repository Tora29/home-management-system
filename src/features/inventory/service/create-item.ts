'use server'

import { prisma } from '@/shared/lib/prisma'

import { itemRepository, itemHistoryRepository } from '../repository/repository'

import type { CreateItemInput } from '../model/validators'
import type { Item } from '@prisma/client'

/**
 * 在庫アイテム作成のユースケース
 */
export async function createInventoryItem(
  input: CreateItemInput & { userId?: string },
): Promise<Item> {
  // トランザクション管理
  return await prisma.$transaction(async (tx) => {
    // 冪等性チェック: 同名のアイテムが既に存在するか確認
    const existingItem = await itemRepository.findByName(input.name, tx)
    if (existingItem) {
      throw new Error(`Item with name "${input.name}" already exists`)
    }

    // ビジネスロジック: 初期値の設定など
    const itemData: CreateItemInput = {
      ...input,
      quantity: input.quantity || 0,
    }

    // アイテムを作成
    const item = await itemRepository.create(itemData, tx)

    // 履歴を記録
    await itemHistoryRepository.create(
      {
        itemId: item.id,
        action: 'ADD',
        quantity: item.quantity,
        unit: item.unit,
        afterValue: item.quantity,
        reason: 'Initial creation',
      },
      tx,
    )

    return item
  })
}

/**
 * 在庫数量更新のユースケース
 */
export async function updateInventoryQuantity(
  itemId: string,
  newQuantity: number,
  reason: string,
): Promise<Item> {
  return await prisma.$transaction(async (tx) => {
    // 現在のアイテムを取得
    const currentItem = await itemRepository.findById(itemId, tx)
    if (!currentItem) {
      throw new Error('Item not found')
    }

    // ビジネスロジック: 数量のバリデーション
    if (newQuantity < 0) {
      throw new Error('Quantity cannot be negative')
    }

    // 数量を更新
    const updatedItem = await itemRepository.updateQuantity(itemId, newQuantity, tx)

    // 履歴を記録
    await itemHistoryRepository.create(
      {
        itemId,
        action: 'UPDATE',
        quantity: newQuantity - currentItem.quantity,
        unit: currentItem.unit,
        beforeValue: currentItem.quantity,
        afterValue: newQuantity,
        reason,
      },
      tx,
    )

    return updatedItem
  })
}
