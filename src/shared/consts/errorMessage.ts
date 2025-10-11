/**
 * エラーメッセージ定数
 */

/**
 * 汎用エラーメッセージ
 */
export const COMMON_ERROR = {
  REQUIRED: '必須項目です',
  INVALID_FORMAT: '正しい形式で入力してください',
  SYSTEM_ERROR: 'システムエラーが発生しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  PERMISSION_DENIED: '権限がありません',
  NOT_FOUND: '見つかりませんでした',
} as const

/**
 * バリデーションエラーメッセージ
 */
export const VALIDATION_ERROR = {
  // 文字列関連
  STRING_REQUIRED: '必須項目です',
  STRING_MIN_LENGTH: (min: number) => `${min}文字以上入力してください`,
  STRING_MAX_LENGTH: (max: number) => `${max}文字以下で入力してください`,

  // 数値関連
  NUMBER_REQUIRED: '数値を入力してください',
  NUMBER_MIN: (min: number) => `${min}以上の数値を入力してください`,
  NUMBER_MAX: (max: number) => `${max}以下の数値を入力してください`,
  NUMBER_POSITIVE: '正の数値を入力してください',
  NUMBER_INTEGER: '整数を入力してください',

  // 日付関連
  DATE_REQUIRED: '日付を選択してください',
  DATE_FUTURE: '未来の日付を設定してください',
  DATE_PAST: '過去の日付を設定してください',
  DATE_INVALID: '有効な日付を入力してください',

  // その他
  EMAIL_INVALID: '有効なメールアドレスを入力してください',
  URL_INVALID: '有効なURLを入力してください',
  PHONE_INVALID: '有効な電話番号を入力してください',
  PATTERN_MISMATCH: '正しい形式で入力してください',
} as const
