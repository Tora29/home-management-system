/**
 * APIエラーを処理する関数
 * エラーメッセージを整形して例外をスロー
 * @param response レスポンス
 * @returns エラー
 */
export const throwApiError = async (response: Response): Promise<never> => {
	let errorBody = '';
	if (response.headers.get('content-type')?.includes('application/json')) {
		const json = await response.json();
		errorBody = JSON.stringify(json);
	}

	const errorMessage = `APIエラー: ${response.status} - ${response.statusText} - ${errorBody}`;
	throw new Error(errorMessage);
};
