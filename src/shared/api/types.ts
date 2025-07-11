/**
 * API応答の共通フォーマット
 * @template T レスポンスデータの型
 */
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

/**
 * APIエラー情報
 */
export interface ApiError {
  message: string;
  status?: number;
  statusText?: string;
}

/**
 * Fetch関数のオプション
 */
export interface FetchOptions extends RequestInit {
  timeout?: number;
}

/**
 * HTTPメソッドの型定義
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * ユーザーエンティティの型定義
 */
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * ユーザー作成リクエストの型定義
 */
export interface CreateUserRequest {
  email: string;
  name?: string;
}

/**
 * ユーザー更新リクエストの型定義
 */
export interface UpdateUserRequest {
  email?: string;
  name?: string;
}

/**
 * ページネーションパラメータ
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * ページネーション対応のレスポンス
 * @template T データの型
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

/**
 * APIから返されるエラーレスポンス
 */
export interface ApiErrorResponse {
  error: string;
  message?: string;
  details?: Record<string, unknown>;
}