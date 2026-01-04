// 登録固有のエラーメッセージ定数
// メール・パスワードの共通エラーは shared/errorMessage/auth.ts を使用
export const ERROR_MESSAGES = {
  email: {
    duplicate: "このメールアドレスは既に登録されています",
  },
  name: {
    maxLength: "名前は50文字以内で入力してください",
  },
} as const;
