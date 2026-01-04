// React・ライブラリ
import { Form } from "react-router";

// 型定義
import type { FieldErrors } from "~/shared/types/result";

// 共有コンポーネント
import { AuthSubmitButton, PasswordInputField } from "~/shared/components/auth";

type PasswordResetConfirmFormProps = {
  errors: FieldErrors | null;
};

/**
 * パスワードリセット確認フォームコンポーネント
 * 新しいパスワードとパスワード確認の入力フィールド、送信ボタンを含む
 */
export function PasswordResetConfirmForm({
  errors,
}: PasswordResetConfirmFormProps) {
  return (
    <Form method="post" className="space-y-6">
      {/* 新しいパスワード */}
      <PasswordInputField
        name="password"
        label="新しいパスワード"
        placeholder="8文字以上"
        autoComplete="new-password"
        error={errors?.password?.[0]}
      />

      {/* パスワード確認 */}
      <PasswordInputField
        name="passwordConfirm"
        label="パスワード（確認）"
        placeholder="もう一度入力"
        autoComplete="new-password"
        error={errors?.passwordConfirm?.[0]}
      />

      {/* 送信ボタン */}
      <AuthSubmitButton label="パスワードを変更" loadingLabel="設定中..." />
    </Form>
  );
}
