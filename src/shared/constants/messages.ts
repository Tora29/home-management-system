/**
 * アプリケーション全体で使用するメッセージ定数
 * エラーメッセージ、成功メッセージ、情報メッセージを統一管理
 */

/**
 * エラーメッセージ定数
 * APIエラー、バリデーションエラー、システムエラーなど
 */
export const ERROR_MESSAGES = {
  // 汎用エラー
  UNEXPECTED_ERROR: '予期しないエラーが発生しました',
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  TIMEOUT_ERROR: 'リクエストがタイムアウトしました',
  SERVER_ERROR: 'サーバーエラーが発生しました',
  
  // データベース関連エラー
  DATABASE_ERROR: 'データベースエラーが発生しました',
  DATA_NOT_FOUND: 'データが見つかりません',
  DATA_ALREADY_EXISTS: 'データが既に存在します',
  
  // ユーザー関連エラー
  USER_NOT_FOUND: 'ユーザーが見つかりません',
  USER_ALREADY_EXISTS: 'ユーザーが既に存在します',
  USER_CREATE_FAILED: 'ユーザーの作成に失敗しました',
  USER_UPDATE_FAILED: 'ユーザーの更新に失敗しました',
  USER_DELETE_FAILED: 'ユーザーの削除に失敗しました',
  
  // バリデーションエラー
  VALIDATION_ERROR: '入力値に問題があります',
  EMAIL_REQUIRED: 'メールアドレスは必須です',
  EMAIL_INVALID: 'メールアドレスの形式が正しくありません',
  NAME_REQUIRED: '名前は必須です',
  NAME_TOO_LONG: '名前は50文字以内で入力してください',
  
  // 認証・認可エラー
  UNAUTHORIZED: '認証が必要です',
  FORBIDDEN: 'アクセス権限がありません',
  SESSION_EXPIRED: 'セッションが期限切れです',
  
  // API関連エラー
  INVALID_REQUEST: '不正なリクエストです',
  INVALID_METHOD: '許可されていないメソッドです',
  INVALID_PARAMETER: 'パラメータが正しくありません',
  RATE_LIMIT_EXCEEDED: 'リクエスト数の上限を超えました',
  
  // ファイル関連エラー
  FILE_NOT_FOUND: 'ファイルが見つかりません',
  FILE_TOO_LARGE: 'ファイルサイズが上限を超えています',
  FILE_TYPE_INVALID: 'ファイル形式が正しくありません',
  
  // その他のエラー
  OPERATION_FAILED: '操作に失敗しました',
  PERMISSION_DENIED: '権限がありません',
  RESOURCE_CONFLICT: 'リソースが競合しています'
} as const;

/**
 * 成功メッセージ定数
 * 操作完了、作成、更新、削除などの成功時メッセージ
 */
export const SUCCESS_MESSAGES = {
  // 汎用成功メッセージ
  OPERATION_SUCCESS: '操作が正常に完了しました',
  DATA_SAVED: 'データが保存されました',
  DATA_UPDATED: 'データが更新されました',
  DATA_DELETED: 'データが削除されました',
  
  // ユーザー関連成功メッセージ
  USER_CREATED: 'ユーザーが作成されました',
  USER_UPDATED: 'ユーザー情報が更新されました',
  USER_DELETED: 'ユーザーが削除されました',
  
  // 認証関連成功メッセージ
  LOGIN_SUCCESS: 'ログインしました',
  LOGOUT_SUCCESS: 'ログアウトしました',
  PASSWORD_CHANGED: 'パスワードが変更されました',
  
  // ファイル関連成功メッセージ
  FILE_UPLOADED: 'ファイルがアップロードされました',
  FILE_DELETED: 'ファイルが削除されました'
} as const;

/**
 * 情報メッセージ定数
 * ローディング状態、確認メッセージなど
 */
export const INFO_MESSAGES = {
  // ローディング状態
  LOADING: '読み込み中...',
  LOADING_DATA: 'データを読み込んでいます...',
  PROCESSING: '処理中...',
  SAVING: '保存中...',
  UPLOADING: 'アップロード中...',
  
  // 確認メッセージ
  CONFIRM_DELETE: '削除してよろしいですか？',
  CONFIRM_LOGOUT: 'ログアウトしますか？',
  CONFIRM_CANCEL: 'キャンセルしますか？',
  
  // 空状態メッセージ
  NO_DATA: 'データがありません',
  NO_USERS: 'ユーザーが見つかりません',
  NO_RESULTS: '検索結果がありません',
  
  // その他の情報
  PLEASE_WAIT: 'しばらくお待ちください',
  TRY_AGAIN: '再度お試しください',
  CONTACT_SUPPORT: 'サポートにお問い合わせください'
} as const;

/**
 * メッセージ型定義
 * 型安全性を確保するためのユニオン型
 */
export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;
export type SuccessMessageKey = keyof typeof SUCCESS_MESSAGES;
export type InfoMessageKey = keyof typeof INFO_MESSAGES;

/**
 * メッセージ取得関数
 * 型安全にメッセージを取得するためのヘルパー関数
 */
export const getErrorMessage = (key: ErrorMessageKey): string => {
  return ERROR_MESSAGES[key];
};

export const getSuccessMessage = (key: SuccessMessageKey): string => {
  return SUCCESS_MESSAGES[key];
};

export const getInfoMessage = (key: InfoMessageKey): string => {
  return INFO_MESSAGES[key];
};

/**
 * 全てのメッセージを含むオブジェクト
 * 必要に応じて使用
 */
export const MESSAGES = {
  ERROR: ERROR_MESSAGES,
  SUCCESS: SUCCESS_MESSAGES,
  INFO: INFO_MESSAGES
} as const;