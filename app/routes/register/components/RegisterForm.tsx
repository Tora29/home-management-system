// React・ライブラリ
import { useState } from "react";
import { Form, useNavigation } from "react-router";
import { Eye, EyeOff } from "lucide-react";

// 型定義
import type { FieldErrors } from "~/shared/types/result";
import type { PasswordStrength } from "../schema";

// サービス
import { calculatePasswordStrength } from "../service/password";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
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
        <label htmlFor="password" className="cyberpunk-label">
          PASSWORD
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            autoComplete="new-password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
        {/* パスワード強度インジケーター */}
        {password && renderPasswordStrength(passwordStrength)}
      </div>

      {/* パスワード確認 */}
      <div className="space-y-2">
        <label htmlFor="passwordConfirm" className="cyberpunk-label">
          CONFIRM PASSWORD
        </label>
        <div className="relative">
          <input
            type={showPasswordConfirm ? "text" : "password"}
            id="passwordConfirm"
            name="passwordConfirm"
            autoComplete="new-password"
            placeholder="********"
            className={`cyberpunk-input cyberpunk-input-password ${errors?.passwordConfirm ? "cyberpunk-input-error" : ""}`}
          />
          <div className="cyberpunk-input-corner" />
          <button
            type="button"
            onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
            className="cyberpunk-password-toggle"
            aria-label={
              showPasswordConfirm ? "パスワードを隠す" : "パスワードを表示"
            }
          >
            {showPasswordConfirm ? (
              <EyeOff size={18} aria-hidden="true" />
            ) : (
              <Eye size={18} aria-hidden="true" />
            )}
          </button>
        </div>
        {errors?.passwordConfirm && (
          <p role="alert" className="cyberpunk-error-text">
            <span className="cyberpunk-error-dot" />
            {errors.passwordConfirm[0]}
          </p>
        )}
      </div>

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
