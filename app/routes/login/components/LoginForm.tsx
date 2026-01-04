// React・ライブラリ
import { Form } from "react-router";

// 型定義
import type { FieldErrors } from "~/shared/types/result";

// 共有コンポーネント
import {
  AuthInputField,
  AuthSubmitButton,
  PasswordInputField,
} from "~/shared/components/auth";

type LoginFormProps = {
  errors: FieldErrors | null;
};

/**
 * ログインフォームコンポーネント
 * メールアドレスとパスワードの入力フィールド、送信ボタンを含む
 */
export function LoginForm({ errors }: LoginFormProps) {
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

      {/* パスワード */}
      <PasswordInputField
        name="password"
        label="パスワード"
        placeholder="8文字以上"
        autoComplete="current-password"
        error={errors?.password?.[0]}
      />

      {/* ログインボタン */}
      <AuthSubmitButton label="ログイン" loadingLabel="ログイン中..." />
    </Form>
  );
}
