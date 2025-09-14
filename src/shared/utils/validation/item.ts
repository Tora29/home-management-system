import type { CreateItemInput } from '@/entities/inventory/model'

/**
 * Validates item input data
 */
export function validateItemInput(input: CreateItemInput): {
  success: boolean
  errors: Record<string, string>
} {
  const errors: Record<string, string> = {}

  // 必須項目のチェック
  if (!input.name || input.name.trim() === '') {
    errors.name = 'アイテム名は必須です'
  }

  if (input.quantity === null || input.quantity === undefined || input.quantity < 0) {
    errors.quantity = '数量は0以上の数値を入力してください'
  }

  if (!input.unit) {
    errors.unit = '単位は必須です'
  }

  if (!input.categoryId) {
    errors.categoryId = 'カテゴリは必須です'
  }

  // 在庫数の整合性チェック
  if (
    input.minimumStock !== null &&
    input.minimumStock !== undefined &&
    input.maximumStock !== null &&
    input.maximumStock !== undefined
  ) {
    if (input.minimumStock > input.maximumStock) {
      errors.stock = '最小在庫数は最大在庫数以下にしてください'
    }
  }

  // 賞味期限の妥当性チェック
  if (input.expiryDate) {
    const expiry = new Date(input.expiryDate)
    if (expiry < new Date()) {
      errors.expiryDate = '賞味期限は未来の日付を設定してください'
    }
  }

  return {
    success: Object.keys(errors).length === 0,
    errors,
  }
}
