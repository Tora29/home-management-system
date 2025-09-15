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

/**
 * 在庫アイテムエラーメッセージ
 */
export const ITEM_ERROR = {
  NAME_REQUIRED: 'アイテム名は必須です',
  QUANTITY_REQUIRED: '数量は必須です',
  QUANTITY_MIN: '数量は1以上の数値を入力してください',
  UNIT_REQUIRED: '単位は必須です',
  CATEGORY_REQUIRED: 'カテゴリは必須です',
  LOCATION_REQUIRED: '保管場所は必須です',

  STOCK_INVALID_RANGE: '最小在庫数は最大在庫数以下にしてください',
  EXPIRY_DATE_PAST: '賞味期限は未来の日付を設定してください',
  BARCODE_INVALID: '有効なバーコードを入力してください',

  CREATE_FAILED: 'アイテムの登録に失敗しました',
  UPDATE_FAILED: 'アイテムの更新に失敗しました',
  DELETE_FAILED: 'アイテムの削除に失敗しました',
  NOT_FOUND: 'アイテムが見つかりません',
  DUPLICATE_NAME: '同じ名前のアイテムが既に存在します',
} as const

/**
 * カテゴリエラーメッセージ
 */
export const CATEGORY_ERROR = {
  NAME_REQUIRED: 'カテゴリ名は必須です',
  NAME_DUPLICATE: '同じ名前のカテゴリが既に存在します',
  CREATE_FAILED: 'カテゴリの作成に失敗しました',
  UPDATE_FAILED: 'カテゴリの更新に失敗しました',
  DELETE_FAILED: 'カテゴリの削除に失敗しました',
  HAS_ITEMS: 'このカテゴリには商品が登録されているため削除できません',
  NOT_FOUND: 'カテゴリが見つかりません',
} as const

/**
 * フォームエラーメッセージ
 */
export const FORM_ERROR = {
  SUBMIT_FAILED: 'フォームの送信に失敗しました',
  VALIDATION_FAILED: '入力内容にエラーがあります',
  REQUIRED_FIELDS: '必須項目を入力してください',
} as const
