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
  placeholder = "8文字以上",
  autoComplete,
  error,
  value,
  onChange,
}: PasswordInputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-hig-label"
      >
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
          className={`
            w-full px-4 py-3 pr-12
            bg-hig-gray6 dark:bg-hig-gray
            text-base text-hig-label
            placeholder:text-hig-secondary-label
            rounded-xl
            border-2 border-transparent
            focus:outline-none focus:border-hig-blue
            transition-colors
            ${error ? "border-hig-red" : ""}
          `}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="
            absolute right-3 top-1/2 -translate-y-1/2
            p-1
            text-hig-secondary-label
            hover:text-hig-label
            transition-colors
          "
          aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
        >
          {showPassword ? (
            <EyeOff size={20} aria-hidden="true" />
          ) : (
            <Eye size={20} aria-hidden="true" />
          )}
        </button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-hig-red">
          {error}
        </p>
      )}
    </div>
  );
}
