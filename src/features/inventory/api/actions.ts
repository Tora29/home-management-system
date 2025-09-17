'use server'

import { revalidatePath } from 'next/cache'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { redirect } from 'next/navigation'

import { ZodError } from 'zod'

import { CreateItemSchema, type CreateItemInput } from '@/entities/inventory/model'
import { ITEM_ERROR } from '@/shared/consts/errorMessage'
import { prisma } from '@/shared/lib/prisma'

import type { Item, ItemHistory } from '@prisma/client'

/**
 * FormDataを処理してオブジェクトに変換
 */
export function processFormData(formData: FormData): {
  name: string
  description?: string
  quantity: FormDataEntryValue
  unit: string
  location: string
  barcode?: string
  notes?: string
  categoryId: string
} {
  const rawInput = Object.fromEntries(formData.entries())

  return {
    name: String(rawInput.name || ''),
    description: rawInput.description ? String(rawInput.description) : undefined,
    quantity: rawInput.quantity,
    unit: String(rawInput.unit || ''),
    location: String(rawInput.location || ''),
    barcode: rawInput.barcode ? String(rawInput.barcode) : undefined,
    notes: rawInput.notes ? String(rawInput.notes) : undefined,
    categoryId: String(rawInput.categoryId || ''),
  }
}

/**
 * 入力データをバリデーション
 */
export function validateItemData(data: ReturnType<typeof processFormData>): CreateItemInput {
  return CreateItemSchema.parse(data)
}

/**
 * アイテムをデータベースに保存
 */
export async function saveItem(validatedData: ReturnType<typeof validateItemData>): Promise<Item> {
  return await prisma.item.create({
    data: validatedData,
  })
}

/**
 * 在庫履歴を記録
 */
export async function recordItemHistory(
  item: Awaited<ReturnType<typeof saveItem>>,
): Promise<ItemHistory> {
  return await prisma.itemHistory.create({
    data: {
      itemId: item.id,
      action: 'ADD',
      quantity: item.quantity,
      unit: item.unit,
      afterValue: item.quantity,
      reason: 'Initial registration',
    },
  })
}

/**
 * 在庫アイテムを作成するサーバーアクション
 */
export async function createItemAction(
  _prevState: { success: boolean; errors?: Record<string, string>; error?: string } | null,
  formData: FormData,
): Promise<{ success: boolean; errors?: Record<string, string>; error?: string } | never> {
  try {
    // FormDataを処理
    const processedInput = processFormData(formData)

    // バリデーション
    const validatedData = validateItemData(processedInput)

    if (!validatedData) {
      return {
        success: false,
        error: ITEM_ERROR.CREATE_FAILED,
      }
    }

    // データベースに保存
    const item = await saveItem(validatedData)

    // 在庫履歴を記録
    await recordItemHistory(item)

    // キャッシュを再検証
    revalidatePath('/inventory')

    // 成功時はリダイレクト
    redirect('/inventory')
  } catch (error) {
    // Zodのバリデーションエラーを処理
    if (error instanceof ZodError) {
      const errors: Record<string, string> = {}
      error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0].toString()] = issue.message
        }
      })
      return {
        success: false,
        errors,
      }
    }

    // Next.jsのredirectエラーは再スロー
    if (isRedirectError(error)) {
      throw error
    }

    return {
      success: false,
      error: ITEM_ERROR.CREATE_FAILED,
    }
  }
}
