import { FetchError, logError } from './errorHandler';
import { ERROR_MESSAGES } from '$shared/constants/messages';
import type { ApiResponse, FetchOptions } from './types';

/** デフォルトのタイムアウト時間（ミリ秒） */
const DEFAULT_TIMEOUT = 10000;

/**
 * 基本的なAPI fetch関数
 * タイムアウト処理、エラーハンドリング、レスポンス形式の統一を行う
 * @template T レスポンスデータの型
 * @param url リクエストURL
 * @param options Fetchオプション
 * @returns 統一されたAPIレスポンス
 */
export const apiFetch = async <T>(
  url: string,
  options: FetchOptions = {}
): Promise<ApiResponse<T>> => {
  const { timeout = DEFAULT_TIMEOUT, ...fetchOptions } = options;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      throw new FetchError(errorMessage, response.status, response.statusText);
    }

    const contentType = response.headers.get('content-type');
    let data: T;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = (await response.text()) as T;
    }

    return {
      data,
      error: null,
      success: true
    };
  } catch (error) {
    logError(error, `API Fetch: ${url}`);
    
    if (error instanceof FetchError) {
      return {
        data: null,
        error: error.message,
        success: false
      };
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return {
          data: null,
          error: ERROR_MESSAGES.TIMEOUT_ERROR,
          success: false
        };
      }

      return {
        data: null,
        error: error.message,
        success: false
      };
    }

    return {
      data: null,
      error: ERROR_MESSAGES.UNEXPECTED_ERROR,
      success: false
    };
  }
};

/**
 * GET リクエストを送信する
 * @template T レスポンスデータの型
 * @param url リクエストURL
 * @param options Fetchオプション（method、bodyを除く）
 * @returns 統一されたAPIレスポンス
 */
export const apiGet = async <T>(
  url: string,
  options?: Omit<FetchOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> => {
  return apiFetch<T>(url, {
    ...options,
    method: 'GET'
  });
};

/**
 * POST リクエストを送信する
 * @template T レスポンスデータの型
 * @param url リクエストURL
 * @param data 送信するデータ
 * @param options Fetchオプション（method、bodyを除く）
 * @returns 統一されたAPIレスポンス
 */
export const apiPost = async <T, TData = unknown>(
  url: string,
  data?: TData,
  options?: Omit<FetchOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> => {
  return apiFetch<T>(url, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    },
    body: data ? JSON.stringify(data) : undefined
  });
};

/**
 * PUT リクエストを送信する
 * @template T レスポンスデータの型
 * @param url リクエストURL
 * @param data 送信するデータ
 * @param options Fetchオプション（method、bodyを除く）
 * @returns 統一されたAPIレスポンス
 */
export const apiPut = async <T, TData = unknown>(
  url: string,
  data?: TData,
  options?: Omit<FetchOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> => {
  return apiFetch<T>(url, {
    ...options,
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers
    },
    body: data ? JSON.stringify(data) : undefined
  });
};

/**
 * DELETE リクエストを送信する
 * @template T レスポンスデータの型
 * @param url リクエストURL
 * @param options Fetchオプション（method、bodyを除く）
 * @returns 統一されたAPIレスポンス
 */
export const apiDelete = async <T>(
  url: string,
  options?: Omit<FetchOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> => {
  return apiFetch<T>(url, {
    ...options,
    method: 'DELETE'
  });
};