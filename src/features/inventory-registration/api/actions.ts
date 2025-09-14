'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { prisma } from '@/shared/lib/prisma'
import { validateItemInput } from '@/shared/utils/validation/item'

import type { CreateItemInput } from '@/entities/inventory/model'

/**
 * 在庫アイテムを作成するサーバーアクション
 */
export async function createItemAction(
  formData: FormData,
): Promise<{ success: boolean; errors?: Record<string, string>; error?: string } | never> {
  try {
    // フォームデータを抽出
    const input: CreateItemInput = {
      name: formData.get('name') as string,
      description: (formData.get('description') as string) || undefined,
      quantity: parseFloat(formData.get('quantity') as string),
      unit: formData.get('unit') as string,
      minimumStock: formData.get('minimumStock')
        ? parseFloat(formData.get('minimumStock') as string)
        : undefined,
      maximumStock: formData.get('maximumStock')
        ? parseFloat(formData.get('maximumStock') as string)
        : undefined,
      location: (formData.get('location') as string) || undefined,
      expiryDate: (formData.get('expiryDate') as string) || undefined,
      barcode: (formData.get('barcode') as string) || undefined,
      notes: (formData.get('notes') as string) || undefined,
      categoryId: formData.get('categoryId') as string,
    }

    // バリデーション
    const validation = validateItemInput(input)
    if (!validation.success) {
      return {
        success: false,
        errors: validation.errors,
      }
    }

    // データベースに保存
    const item = await prisma.item.create({
      data: {
        ...input,
        expiryDate: input.expiryDate ? new Date(input.expiryDate) : undefined,
      },
    })

    // 在庫履歴を記録
    await prisma.itemHistory.create({
      data: {
        itemId: item.id,
        action: 'ADD',
        quantity: item.quantity,
        unit: item.unit,
        afterValue: item.quantity,
        reason: 'Initial registration',
      },
    })

    // キャッシュを再検証
    revalidatePath('/inventory')

    // 成功時はリダイレクト
    redirect('/inventory')
  } catch (error) {
    console.error('Failed to create item:', error)
    return {
      success: false,
      error: 'アイテムの登録に失敗しました',
    }
  }
}
