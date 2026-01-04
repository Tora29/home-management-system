// ログイン固有のエラーメッセージ定数
// メール・パスワードの共通エラーは shared/errorMessage/auth.ts を使用
export const ERROR_MESSAGES = {
  auth: {
    invalidCredentials: "メールアドレスまたはパスワードが正しくありません",
    userNotFound: "ユーザーが見つかりません",
  },
} as const;
