// React・ライブラリ
import { data, Link, useActionData } from "react-router";

// 型定義
import type { Route } from "./+types/route";

// サービス
import * as passwordResetService from "./service/password-reset.service";

// 共有コンポーネント
import { AuthFormCard } from "~/shared/components/auth";

// ローカルコンポーネント
import { PasswordResetForm } from "./components/PasswordResetForm";
import { SuccessMessage } from "./components/SuccessMessage";

// メタ情報
export function meta(_args: Route.MetaArgs) {
  return [
    { title: "パスワードリセット - Home Management System" },
    {
      name: "description",
      content: "パスワードリセット用のリンクをメールで送信します",
    },
  ];
}

// action - リセットリンク送信
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const baseUrl = new URL(request.url).origin;

  const result = await passwordResetService.requestPasswordReset(
    { email: formData.get("email") },
    baseUrl
  );

  if (!result.success) {
    return data({ errors: result.errors }, { status: 400 });
  }

  return { success: true, resetUrl: result.data.resetUrl };
}

// パスワードリセット要求ページコンポーネント
export default function PasswordResetRequestPage(_props: Route.ComponentProps) {
  const actionData = useActionData<typeof action>();

  const errors =
    actionData && "errors" in actionData ? actionData.errors : null;
  const success = actionData && "success" in actionData && actionData.success;
  const resetUrl =
    actionData && "resetUrl" in actionData ? actionData.resetUrl : null;

  return (
    <AuthFormCard
      title="パスワードリセット"
      description="登録済みのメールアドレスを入力してください"
      footer={
        <Link
          to="/login"
          className="text-sm text-hig-blue active:opacity-50 transition-opacity"
        >
          ログインに戻る
        </Link>
      }
    >
      {/* 成功メッセージ */}
      {success && <SuccessMessage resetUrl={resetUrl} />}

      {/* リセット要求フォーム */}
      {!success && <PasswordResetForm errors={errors} />}
    </AuthFormCard>
  );
}

// ErrorBoundary
export { RouteErrorBoundary as ErrorBoundary } from "~/shared/components/RouteErrorBoundary";
