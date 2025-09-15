'use server'

import { revalidatePath } from 'next/cache'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { redirect } from 'next/navigation'

import { ZodError } from 'zod'

import { CreateItemSchema } from '@/entities/inventory/model'
import { ITEM_ERROR } from '@/shared/consts/errorMessage'
import { prisma } from '@/shared/lib/prisma'

/**
 * 在庫アイテムを作成するサーバーアクション
 */
export async function createItemAction(
  _prevState: { success: boolean; errors?: Record<string, string>; error?: string } | null,
  formData: FormData,
): Promise<{ success: boolean; errors?: Record<string, string>; error?: string } | never> {
  try {
    // FormDataをオブジェクトに変換
    const rawInput = Object.fromEntries(formData.entries())

    // 空文字を undefined に変換
    const processedInput = {
      name: rawInput.name || '',
      description: rawInput.description || undefined,
      quantity: rawInput.quantity, // Zodのcoerceに任せる
      unit: rawInput.unit || '',
      location: rawInput.location || '',
      barcode: rawInput.barcode || undefined,
      notes: rawInput.notes || undefined,
      categoryId: rawInput.categoryId || '',
    }

    // Zodでバリデーション
    const validatedData = CreateItemSchema.parse(processedInput)

    if (!validatedData) {
      return {
        success: false,
        error: ITEM_ERROR.CREATE_FAILED,
      }
    }

    // データベースに保存
    const item = await prisma.item.create({
      data: validatedData,
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
