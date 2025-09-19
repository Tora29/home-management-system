'use server'

import { revalidatePath } from 'next/cache'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { redirect } from 'next/navigation'

import { ZodError } from 'zod'

import { ITEM_ERROR } from '@/shared/consts/errorMessage'

import { createItemSchema } from '../model/validators'
import { createInventoryItem } from '../service/create-item'

/**
 * 在庫アイテム作成アクション
 * 責務：
 * 1. 入力検証
 * 2. Service呼び出し
 * 3. キャッシュ制御
 * 4. リダイレクト
 */
export async function createItemAction(
  _prevState: { success: boolean; errors?: Record<string, string>; error?: string } | null,
  formData: FormData,
): Promise<{ success: boolean; errors?: Record<string, string>; error?: string } | never> {
  try {
    // 1. 入力検証
    const rawInput = Object.fromEntries(formData.entries())
    const validatedData = createItemSchema.parse({
      name: String(rawInput.name || ''),
      description: rawInput.description ? String(rawInput.description) : undefined,
      quantity: rawInput.quantity,
      unit: String(rawInput.unit || ''),
      location: String(rawInput.location || ''),
      barcode: rawInput.barcode ? String(rawInput.barcode) : undefined,
      notes: rawInput.notes ? String(rawInput.notes) : undefined,
      categoryId: String(rawInput.categoryId || ''),
    })

    // 2. Service呼び出し
    await createInventoryItem({
      ...validatedData,
    })

    // 3. キャッシュ制御
    revalidatePath('/inventory')
    revalidatePath('/inventory/register')

    // 4. リダイレクト
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

    // ビジネスエラーのメッセージを返す
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: false,
      error: ITEM_ERROR.CREATE_FAILED,
    }
  }
}
