export const ERROR_MESSAGES = {
  email: {
    required: "メールアドレスは必須です",
    invalid: "有効なメールアドレスを入力してください",
    duplicate: "このメールアドレスは既に登録されています",
  },
  name: {
    maxLength: "名前は100文字以内で入力してください",
  },
  id: {
    required: "IDは必須です",
  },
  general: {
    invalidRequest: "不正なリクエストです",
    updateFailed: "更新に失敗しました",
    dataFormatInvalid: "データ形式が不正です",
    validationError: "バリデーションエラー",
  },
} as const;
