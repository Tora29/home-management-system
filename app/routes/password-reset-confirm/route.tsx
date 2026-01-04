// React・ライブラリ
import { data, Link, redirect, useActionData } from "react-router";

// 型定義
import type { Route } from "./+types/route";

// サービス
import * as passwordResetConfirmService from "./service/password-reset-confirm.service";

// 共有コンポーネント
import { AuthFormCard } from "~/shared/components/auth";

// ローカルコンポーネント
import { PasswordResetConfirmForm } from "./components/PasswordResetConfirmForm";

// メタ情報
export function meta(_args: Route.MetaArgs) {
  return [
    { title: "新しいパスワードを設定 - Home Management System" },
    { name: "description", content: "新しいパスワードを設定します" },
  ];
}

// loader - トークンの有効性を確認
export async function loader({ params }: Route.LoaderArgs) {
  return passwordResetConfirmService.validateToken(params.token);
}

// action - 新しいパスワードを設定
export async function action({ request, params }: Route.ActionArgs) {
  const formData = await request.formData();

  const result = await passwordResetConfirmService.resetPassword(params.token, {
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
  });

  if (!result.success) {
    switch (result.type) {
      case "validation":
        return data({ errors: result.errors }, { status: 400 });
      case "token":
        return data({ tokenError: result.message }, { status: 400 });
    }
  }

  // ログインページへリダイレクト（成功メッセージ付き）
  return redirect("/login?reset=success");
}

// 新パスワード設定ページコンポーネント
export default function PasswordResetConfirmPage({
  loaderData,
}: Route.ComponentProps) {
  const actionData = useActionData<typeof action>();

  const errors =
    actionData && "errors" in actionData ? actionData.errors : null;
  const tokenError =
    actionData && "tokenError" in actionData ? actionData.tokenError : null;

  // トークンが無効な場合
  if (!loaderData.success) {
    return (
      <AuthFormCard
        title="エラー"
        description=""
        alert={{ type: "error", message: loaderData.message }}
        footer={
          <Link
            to="/login"
            className="text-sm text-hig-blue active:opacity-50 transition-opacity"
          >
            ログインに戻る
          </Link>
        }
      >
        <Link
          to="/password-reset"
          className="
            block w-full text-center
            bg-hig-blue text-white
            px-5 py-3
            rounded-xl
            text-base font-semibold
            active:opacity-70
            transition-opacity
            min-h-[50px]
          "
        >
          再度リセットを申請
        </Link>
      </AuthFormCard>
    );
  }

  return (
    <AuthFormCard
      title="新しいパスワードを設定"
      description={`${loaderData.data.email} のパスワードを再設定します`}
      alert={tokenError ? { type: "error", message: tokenError } : undefined}
      footer={
        <Link
          to="/login"
          className="text-sm text-hig-blue active:opacity-50 transition-opacity"
        >
          ログインに戻る
        </Link>
      }
    >
      <PasswordResetConfirmForm errors={errors} />
    </AuthFormCard>
  );
}

// ErrorBoundary
export { RouteErrorBoundary as ErrorBoundary } from "~/shared/components/RouteErrorBoundary";
