// 認証関連の共有エラーメッセージ定数
export const AUTH_ERROR_MESSAGES = {
  email: {
    required: "メールアドレスを入力してください",
    invalid: "正しいメールアドレス形式で入力してください",
  },
  password: {
    required: "パスワードを入力してください",
    minLength: "パスワードは8文字以上で入力してください",
  },
  passwordConfirm: {
    required: "確認用パスワードを入力してください",
    mismatch: "パスワードが一致しません",
  },
} as const;
