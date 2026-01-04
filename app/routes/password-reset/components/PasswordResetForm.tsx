// React・ライブラリ
import { Form } from "react-router";

// 型定義
import type { FieldErrors } from "~/shared/types/result";

// 共有コンポーネント
import { AuthInputField, AuthSubmitButton } from "~/shared/components/auth";

type PasswordResetFormProps = {
  errors: FieldErrors | null;
};

/**
 * パスワードリセット要求フォームコンポーネント
 * メールアドレス入力と送信ボタンを含む
 */
export function PasswordResetForm({ errors }: PasswordResetFormProps) {
  return (
    <Form method="post" className="space-y-6">
      {/* メールアドレス */}
      <AuthInputField
        type="email"
        name="email"
        label="メールアドレス"
        placeholder="example@email.com"
        autoComplete="email"
        error={errors?.email?.[0]}
      />

      {/* 送信ボタン */}
      <AuthSubmitButton label="リセットリンクを送信" loadingLabel="送信中..." />
    </Form>
  );
}
