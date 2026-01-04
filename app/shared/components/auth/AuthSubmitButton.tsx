// React・ライブラリ
import { useNavigation } from "react-router";

// 型定義
type AuthSubmitButtonProps = {
  label: string;
  loadingLabel: string;
};

/**
 * 認証フォーム用の送信ボタンコンポーネント
 * useNavigation を使用してローディング状態を管理
 */
export function AuthSubmitButton({
  label,
  loadingLabel,
}: AuthSubmitButtonProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className="
        w-full
        bg-hig-blue text-white
        px-5 py-3
        rounded-xl
        text-base font-semibold
        active:opacity-70
        transition-opacity
        disabled:opacity-40
        min-h-[50px]
      "
    >
      {isSubmitting ? loadingLabel : label}
    </button>
  );
}
