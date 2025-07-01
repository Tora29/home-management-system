import { throwApiError } from './errorHandler';

/**
 * APIからデータを取得する汎用関数
 * @param url APIエンドポイントのパス
 * @returns Promise<T[]> 取得したデータの配列
 */
export async function apiLoad<T>(
	url: string,
	fetchFn: typeof fetch,
	errorHandler?: (error: Error) => void
): Promise<T[]> {
	try {
		const response = await fetchFn(url);
		// HTTPステータスがエラーのときはエラー処理を実行
		if (!response.ok) {
			await throwApiError(response);
		}
		// 正常なレスポンスの場合はJSONをパースして返す
		return await response.json();
	} catch (error) {
		// エラーが発生した場合はエラーハンドラーを実行
		if (errorHandler) {
			const err = error instanceof Error ? error : new Error(String(error));
			errorHandler(err);
		}
		// エラーを再スロー
		throw error;
	}
}
