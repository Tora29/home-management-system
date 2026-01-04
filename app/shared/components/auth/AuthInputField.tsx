// 型定義
type AuthInputFieldProps = {
  type: "text" | "email";
  name: string;
  label: string;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  optional?: boolean;
};

/**
 * 認証フォーム用の入力フィールドコンポーネント
 * メールアドレスや名前の入力に使用
 */
export function AuthInputField({
  type,
  name,
  label,
  placeholder,
  autoComplete,
  error,
  optional = false,
}: AuthInputFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={name}
        className="block text-sm font-medium text-hig-label"
      >
        {label}
        {optional && (
          <span className="ml-2 text-xs text-hig-secondary-label">
            （任意）
          </span>
        )}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        autoComplete={autoComplete}
        className={`
          w-full px-4 py-3
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
      {error && (
        <p role="alert" className="text-sm text-hig-red">
          {error}
        </p>
      )}
    </div>
  );
}
