// バリデーションエラーメッセージ定数
export const ERROR_MESSAGES = {
	// 必須入力系
	REQUIRED: '必須項目です'
} as const;

// 型定義をエクスポート
export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;
