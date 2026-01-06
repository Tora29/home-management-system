// React・ライブラリ
import { Form, useNavigation } from "react-router";

// 型定義
import type { FieldErrors } from "~/shared/types/result";

// 共有コンポーネント
import { PasswordInputField } from "~/shared/components/auth";

type PasswordResetConfirmFormProps = {
  errors: FieldErrors | null;
};

/** パスワードリセット確認フォーム */
export function PasswordResetConfirmForm({
  errors,
}: PasswordResetConfirmFormProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Form method="post" className="space-y-6">
      {/* 新しいパスワード */}
      <PasswordInputField
        name="password"
        label="NEW PASSWORD"
        autoComplete="new-password"
        error={errors?.password?.[0]}
      />

      {/* パスワード確認 */}
      <PasswordInputField
        name="passwordConfirm"
        label="CONFIRM PASSWORD"
        autoComplete="new-password"
        error={errors?.passwordConfirm?.[0]}
      />

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
            UPDATING...
          </span>
        ) : (
          "UPDATE PASSWORD"
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
