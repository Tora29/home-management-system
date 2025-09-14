'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { prisma } from '@/shared/lib/prisma'

import type { CreateItemInput } from '@/entities/item/model'
import type { Category, Unit, Location } from '@prisma/client'

/**
 * 在庫アイテムを新規作成する
 */
export async function createItem(formData: FormData): Promise<void> {
  const data: CreateItemInput = {
    name: formData.get('name') as string,
    categoryId: formData.get('categoryId') as string,
    quantity: Number(formData.get('quantity')),
    unit: formData.get('unit') as string,
    location: formData.get('location') as string || undefined,
    notes: formData.get('notes') as string || undefined,
    minimumStock: formData.get('minimumStock') ? Number(formData.get('minimumStock')) : undefined,
  }

  const expiryDateStr = formData.get('expiryDate') as string
  if (expiryDateStr) {
    data.expiryDate = new Date(expiryDateStr)
  }

  if (!data.name || !data.categoryId || data.quantity < 0 || !data.unit) {
    throw new Error('必須項目が入力されていません')
  }

  if (data.name.length > 100) {
    throw new Error('アイテム名は100文字以内で入力してください')
  }

  if (data.location && data.location.length > 50) {
    throw new Error('保管場所は50文字以内で入力してください')
  }

  if (data.notes && data.notes.length > 500) {
    throw new Error('備考は500文字以内で入力してください')
  }

  const newItem = await prisma.item.create({
    data: {
      ...data,
      quantity: data.quantity,
      minimumStock: data.minimumStock || null,
    },
    include: {
      category: true,
    },
  })

  await prisma.itemHistory.create({
    data: {
      itemId: newItem.id,
      action: 'ADD',
      quantity: data.quantity,
      unit: data.unit,
      afterValue: data.quantity,
      reason: '新規登録',
    },
  })

  revalidatePath('/inventory')
  redirect('/inventory')
}

/**
 * カテゴリ一覧を取得する
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await prisma.category.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { sortOrder: 'asc' },
        { name: 'asc' },
      ],
    })
    return categories
  } catch (error) {
    console.error('カテゴリの取得に失敗しました:', error)
    return []
  }
}

/**
 * 単位一覧を取得する
 */
export async function getUnits(): Promise<Unit[]> {
  try {
    const units = await prisma.unit.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { sortOrder: 'asc' },
        { displayName: 'asc' },
      ],
    })
    return units
  } catch (error) {
    console.error('単位の取得に失敗しました:', error)
    return []
  }
}

/**
 * 保管場所一覧を取得する
 */
export async function getLocations(): Promise<Location[]> {
  try {
    const locations = await prisma.location.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { sortOrder: 'asc' },
        { displayName: 'asc' },
      ],
    })
    return locations
  } catch (error) {
    console.error('保管場所の取得に失敗しました:', error)
    return []
  }
}