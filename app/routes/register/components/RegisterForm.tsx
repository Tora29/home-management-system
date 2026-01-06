// React・ライブラリ
import { useState } from "react";
import { Form, useNavigation } from "react-router";

// 型定義
import type { FieldErrors } from "~/shared/types/result";
import type { PasswordStrength } from "../schema";

// サービス
import { calculatePasswordStrength } from "../service/password";

// 共有コンポーネント
import { PasswordInputField } from "~/shared/components/auth";

type RegisterFormProps = {
  errors: FieldErrors | null;
  renderPasswordStrength: (strength: PasswordStrength) => React.ReactNode;
};

/** 登録フォーム */
export function RegisterForm({
  errors,
  renderPasswordStrength,
}: RegisterFormProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [password, setPassword] = useState("");
  const passwordStrength = calculatePasswordStrength(password);

  return (
    <Form method="post" className="space-y-6">
      {/* メールアドレス */}
      <div className="space-y-2">
        <label htmlFor="email" className="cyberpunk-label">
          EMAIL ADDRESS
        </label>
        <div className="relative">
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            placeholder="user@example.com"
            className={`cyberpunk-input ${errors?.email ? "cyberpunk-input-error" : ""}`}
          />
          <div className="cyberpunk-input-corner" />
        </div>
        {errors?.email && (
          <p role="alert" className="cyberpunk-error-text">
            <span className="cyberpunk-error-dot" />
            {errors.email[0]}
          </p>
        )}
      </div>

      {/* 名前（任意） */}
      <div className="space-y-2">
        <label htmlFor="name" className="cyberpunk-label">
          NAME <span className="opacity-60">(OPTIONAL)</span>
        </label>
        <div className="relative">
          <input
            type="text"
            id="name"
            name="name"
            autoComplete="name"
            placeholder="John Doe"
            className={`cyberpunk-input ${errors?.name ? "cyberpunk-input-error" : ""}`}
          />
          <div className="cyberpunk-input-corner" />
        </div>
        {errors?.name && (
          <p role="alert" className="cyberpunk-error-text">
            <span className="cyberpunk-error-dot" />
            {errors.name[0]}
          </p>
        )}
      </div>

      {/* パスワード */}
      <div className="space-y-2">
        <PasswordInputField
          name="password"
          label="PASSWORD"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors?.password?.[0]}
        />
        {/* パスワード強度インジケーター */}
        {password && renderPasswordStrength(passwordStrength)}
      </div>

      {/* パスワード確認 */}
      <PasswordInputField
        name="passwordConfirm"
        label="CONFIRM PASSWORD"
        autoComplete="new-password"
        error={errors?.passwordConfirm?.[0]}
      />

      {/* 登録ボタン */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="cyberpunk-button"
      >
        {/* ボタン内装飾ドット */}
        <div className="absolute top-2 left-3 cyberpunk-button-dots">
          <div
            className={`cyberpunk-button-dot ${isSubmitting ? "cyberpunk-button-dot-active" : "cyberpunk-button-dot-50"}`}
          />
          <div
            className={`cyberpunk-button-dot ${isSubmitting ? "cyberpunk-button-dot-active" : "cyberpunk-button-dot-30"}`}
          />
        </div>

        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
            REGISTERING...
          </span>
        ) : (
          "REGISTER"
        )}

        {/* ボタン内装飾ドット（右側） */}
        <div className="absolute bottom-2 right-3 cyberpunk-button-dots">
          <div
            className={`cyberpunk-button-dot ${isSubmitting ? "cyberpunk-button-dot-active" : "cyberpunk-button-dot-30"}`}
          />
          <div
            className={`cyberpunk-button-dot ${isSubmitting ? "cyberpunk-button-dot-active" : "cyberpunk-button-dot-50"}`}
          />
        </div>
      </button>
    </Form>
  );
}
