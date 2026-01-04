// パスワードリセット確認画面の固有エラーメッセージ定数
// パスワードの共通エラーは shared/errorMessage/auth.ts を使用
export const ERROR_MESSAGES = {
  token: {
    invalid: "無効なリセットリンクです",
    expired: "リセットリンクの有効期限が切れています",
    used: "このリセットリンクは既に使用されています",
  },
} as const;
