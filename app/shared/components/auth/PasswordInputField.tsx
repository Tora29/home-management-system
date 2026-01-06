// React・ライブラリ
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// 型定義
type PasswordInputFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

/**
 * パスワード入力フィールドコンポーネント
 * Eye/EyeOff によるパスワード表示/非表示機能付き
 */
export function PasswordInputField({
  name,
  label,
  placeholder = "********",
  autoComplete,
  error,
  value,
  onChange,
}: PasswordInputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label htmlFor={name} className="cyberpunk-label">
        {label}
      </label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id={name}
          name={name}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`cyberpunk-input cyberpunk-input-password ${error ? "cyberpunk-input-error" : ""}`}
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
      {error && (
        <p role="alert" className="cyberpunk-error-text">
          <span className="cyberpunk-error-dot" />
          {error}
        </p>
      )}
    </div>
  );
}
