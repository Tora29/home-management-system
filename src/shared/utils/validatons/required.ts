// バリデーション結果の型定義
export interface ValidationResult {
	isValid: boolean;
	errorMessage?: string;
}

// エラーメッセージをインポート
import { ERROR_MESSAGES } from './errorMessage';

// 必須入力チェック関数
export function required(value: unknown, errorMessage?: string): ValidationResult {
	// 値が空、null、undefined、空文字列の場合はエラー
	if (
		value === null ||
		value === undefined ||
		value === '' ||
		(Array.isArray(value) && value.length === 0)
	) {
		return {
			isValid: false,
			errorMessage: errorMessage || ERROR_MESSAGES.REQUIRED
		};
	}

	return {
		isValid: true
	};
}
