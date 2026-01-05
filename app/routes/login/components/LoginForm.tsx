// React・ライブラリ
import { useState } from "react";
import { Form, useNavigation } from "react-router";
import { Eye, EyeOff } from "lucide-react";

// 型定義
import type { FieldErrors } from "~/shared/types/result";

type LoginFormProps = {
  errors: FieldErrors | null;
};

/** ログインフォーム */
export function LoginForm({ errors }: LoginFormProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [showPassword, setShowPassword] = useState(false);

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

      {/* パスワード */}
      <div className="space-y-2">
        <label htmlFor="password" className="cyberpunk-label">
          PASSWORD
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            autoComplete="current-password"
            placeholder="********"
            className={`cyberpunk-input cyberpunk-input-password ${errors?.password ? "cyberpunk-input-error" : ""}`}
          />
          <div className="cyberpunk-input-corner" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="cyberpunk-password-toggle"
            aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
          >
            {showPassword ? (
              <EyeOff size={18} aria-hidden="true" />
            ) : (
              <Eye size={18} aria-hidden="true" />
            )}
          </button>
        </div>
        {errors?.password && (
          <p role="alert" className="cyberpunk-error-text">
            <span className="cyberpunk-error-dot" />
            {errors.password[0]}
          </p>
        )}
      </div>

      {/* ログインボタン */}
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
            AUTHENTICATING...
          </span>
        ) : (
          "LOGIN"
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
