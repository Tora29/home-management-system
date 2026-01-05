// React・ライブラリ
import { Form, useNavigation } from "react-router";

// 型定義
import type { FieldErrors } from "~/shared/types/result";

type PasswordResetFormProps = {
  errors: FieldErrors | null;
};

/** パスワードリセット要求フォーム */
export function PasswordResetForm({ errors }: PasswordResetFormProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

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

      {/* 送信ボタン */}
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
            SENDING...
          </span>
        ) : (
          "SEND RESET LINK"
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
