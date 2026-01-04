// React・ライブラリ
import { useState } from "react";
import { Form } from "react-router";

// 型定義
import type { FieldErrors } from "~/shared/types/result";
import type { PasswordStrength } from "../schema";

// サービス
import { calculatePasswordStrength } from "../service/password";

// 共有コンポーネント
import {
  AuthInputField,
  AuthSubmitButton,
  PasswordInputField,
} from "~/shared/components/auth";

type RegisterFormProps = {
  errors: FieldErrors | null;
  renderPasswordStrength: (strength: PasswordStrength) => React.ReactNode;
};

/**
 * 登録フォームコンポーネント
 * メールアドレス、名前、パスワード、パスワード確認の入力フィールドを含む
 */
export function RegisterForm({
  errors,
  renderPasswordStrength,
}: RegisterFormProps) {
  const [password, setPassword] = useState("");
  const passwordStrength = calculatePasswordStrength(password);

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

      {/* 名前（任意） */}
      <AuthInputField
        type="text"
        name="name"
        label="名前"
        placeholder="山田 太郎"
        autoComplete="name"
        error={errors?.name?.[0]}
        optional
      />

      {/* パスワード */}
      <div className="space-y-2">
        <PasswordInputField
          name="password"
          label="パスワード"
          placeholder="8文字以上"
          autoComplete="new-password"
          error={errors?.password?.[0]}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* パスワード強度インジケーター */}
        {password && renderPasswordStrength(passwordStrength)}
      </div>

      {/* パスワード（確認） */}
      <PasswordInputField
        name="passwordConfirm"
        label="パスワード（確認）"
        placeholder="パスワードを再入力"
        autoComplete="new-password"
        error={errors?.passwordConfirm?.[0]}
      />

      {/* 登録ボタン */}
      <AuthSubmitButton label="登録する" loadingLabel="登録中..." />
    </Form>
  );
}
