import { prisma } from '@/shared/lib/prisma'

import type { CreateItemInput, UpdateItemInput } from '../model/validators'
import type { Item, ItemHistory, Prisma } from '@prisma/client'

/**
 * 在庫アイテムのリポジトリ
 * 全てのDB操作をここに集約
 */
export const itemRepository = {
  /**
   * アイテムをIDで取得
   */
  findById: async (id: string, tx?: Prisma.TransactionClient) => {
    const client = tx || prisma
    return client.item.findUnique({
      where: { id },
      include: {
        category: true,
      },
    })
  },

  /**
   * アイテムを名前で検索
   */
  findByName: async (name: string, tx?: Prisma.TransactionClient) => {
    const client = tx || prisma
    return client.item.findFirst({
      where: {
        name,
      },
    })
  },

  /**
   * 全アイテムを取得
   */
  findAll: async (tx?: Prisma.TransactionClient) => {
    const client = tx || prisma
    return client.item.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  },

  /**
   * アイテムを作成
   */
  create: async (data: CreateItemInput, tx?: Prisma.TransactionClient): Promise<Item> => {
    const client = tx || prisma
    return client.item.create({
      data,
    })
  },

  /**
   * アイテムを更新
   */
  update: async (
    id: string,
    data: UpdateItemInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Item> => {
    const client = tx || prisma
    return client.item.update({
      where: { id },
      data,
    })
  },

  /**
   * アイテムを削除
   */
  delete: async (id: string, tx?: Prisma.TransactionClient): Promise<Item> => {
    const client = tx || prisma
    return client.item.delete({
      where: { id },
    })
  },

  /**
   * 在庫数量を更新
   */
  updateQuantity: async (
    id: string,
    quantity: number,
    tx?: Prisma.TransactionClient,
  ): Promise<Item> => {
    const client = tx || prisma
    return client.item.update({
      where: { id },
      data: {
        quantity,
        updatedAt: new Date(),
      },
    })
  },
}

/**
 * 在庫履歴のリポジトリ
 */
export const itemHistoryRepository = {
  /**
   * 履歴を作成
   */
  create: async (
    data: {
      itemId: string
      action: string
      quantity: number
      unit: string
      beforeValue?: number
      afterValue: number
      reason?: string
      notes?: string
    },
    tx?: Prisma.TransactionClient,
  ): Promise<ItemHistory> => {
    const client = tx || prisma
    return client.itemHistory.create({
      data,
    })
  },

  /**
   * アイテムの履歴を取得
   */
  findByItemId: async (itemId: string, tx?: Prisma.TransactionClient) => {
    const client = tx || prisma
    return client.itemHistory.findMany({
      where: { itemId },
      orderBy: {
        createdAt: 'desc',
      },
    })
  },
}
