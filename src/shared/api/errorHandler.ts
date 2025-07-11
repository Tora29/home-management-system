import type { ApiError } from './types';

/**
 * HTTP fetch エラーを表すカスタムエラークラス
 */
export class FetchError extends Error {
  public status: number;
  public statusText: string;

  /**
   * FetchError のコンストラクタ
   * @param message エラーメッセージ
   * @param status HTTPステータスコード
   * @param statusText HTTPステータステキスト
   */
  constructor(message: string, status: number, statusText: string) {
    super(message);
    this.name = 'FetchError';
    this.status = status;
    this.statusText = statusText;
  }
}

/**
 * 様々なエラーを統一的に処理し、ApiError 形式に変換する
 * @param error 発生したエラー
 * @returns 統一されたエラー情報
 */
export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof FetchError) {
    return {
      message: `API エラー: ${error.message}`,
      status: error.status,
      statusText: error.statusText
    };
  }

  if (error instanceof Error) {
    return {
      message: `エラー: ${error.message}`
    };
  }

  return {
    message: '予期しないエラーが発生しました'
  };
};

/**
 * エラーをコンソールに出力する
 * @param error 発生したエラー
 * @param context エラーが発生したコンテキスト（例：API名、画面名など）
 */
export const logError = (error: unknown, context?: string): void => {
  const errorInfo = handleApiError(error);
  console.error(
    `[${context || 'API'}] エラーが発生しました:`,
    errorInfo
  );
};