/**
 * 汎用的なバリデーション関数
 */

import { COMMON_ERROR, VALIDATION_ERROR } from '@/shared/consts/errorMessage'

type ValidationRule<T = unknown> = {
  validate: (value: T) => boolean
  message: string
}

type ValidationSchema<T> = {
  [K in keyof T]?: ValidationRule[]
}

type ValidationResult = {
  success: boolean
  errors: Record<string, string>
}

/**
 * 汎用バリデーション関数
 *
 * @param data - 検証するデータ
 * @param schema - バリデーションスキーマ
 * @returns バリデーション結果
 */
export function validate<T extends Record<string, unknown>>(
  data: T,
  schema: ValidationSchema<T>,
): ValidationResult {
  const errors: Record<string, string> = {}

  for (const [field, rules] of Object.entries(schema)) {
    if (!rules) {
      continue
    }

    const value = data[field as keyof T]
    const fieldRules = rules as ValidationRule[]

    for (const rule of fieldRules) {
      if (!rule.validate(value)) {
        errors[field] = rule.message
        break // 最初のエラーで終了
      }
    }
  }

  return {
    success: Object.keys(errors).length === 0,
    errors,
  }
}

/**
 * よく使うバリデーションルール
 */
export const validators = {
  required: (message?: string): ValidationRule => ({
    validate: (value) => value !== null && value !== undefined && value !== '',
    message: message || COMMON_ERROR.REQUIRED,
  }),

  requiredString: (message?: string): ValidationRule => ({
    validate: (value) => typeof value === 'string' && value.trim() !== '',
    message: message || VALIDATION_ERROR.STRING_REQUIRED,
  }),

  minNumber: (min: number, message?: string): ValidationRule => ({
    validate: (value) => typeof value === 'number' && value >= min,
    message: message || VALIDATION_ERROR.NUMBER_MIN(min),
  }),

  maxNumber: (max: number, message?: string): ValidationRule => ({
    validate: (value) => typeof value === 'number' && value <= max,
    message: message || VALIDATION_ERROR.NUMBER_MAX(max),
  }),

  minLength: (min: number, message?: string): ValidationRule => ({
    validate: (value) => typeof value === 'string' && value.length >= min,
    message: message || VALIDATION_ERROR.STRING_MIN_LENGTH(min),
  }),

  maxLength: (max: number, message?: string): ValidationRule => ({
    validate: (value) => typeof value === 'string' && value.length <= max,
    message: message || VALIDATION_ERROR.STRING_MAX_LENGTH(max),
  }),

  pattern: (regex: RegExp, message: string): ValidationRule => ({
    validate: (value) => typeof value === 'string' && regex.test(value),
    message,
  }),

  email: (message?: string): ValidationRule => ({
    validate: (value) => typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
    message: message || VALIDATION_ERROR.EMAIL_INVALID,
  }),

  futureDate: (message?: string): ValidationRule => ({
    validate: (value) => {
      if (!value) {
        return true // オプショナルな場合
      }
      const date = new Date(value as string | number | Date)
      return !isNaN(date.getTime()) && date > new Date()
    },
    message: message || VALIDATION_ERROR.DATE_FUTURE,
  }),

  custom: <T = unknown>(validateFn: (value: T) => boolean, message: string): ValidationRule => ({
    validate: validateFn as (value: unknown) => boolean,
    message,
  }),
}
