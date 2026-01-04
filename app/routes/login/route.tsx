// React・ライブラリ
import { data, Link, useActionData, useSearchParams } from "react-router";

// 型定義
import type { Route } from "./+types/route";

// サービス
import * as authService from "./service/auth.service";

// 共有コンポーネント
import { createUserSession } from "~/shared/lib/session.server";
import { AuthFormCard } from "~/shared/components/auth";

// ローカルコンポーネント
import { LoginForm } from "./components/LoginForm";

// メタ情報
export function meta(_args: Route.MetaArgs) {
  return [
    { title: "ログイン - Home Management System" },
    { name: "description", content: "Home Management System へログイン" },
  ];
}

// action
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const result = await authService.login({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!result.success) {
    switch (result.type) {
      case "validation":
        return data({ errors: result.errors }, { status: 400 });
      case "auth":
        return data({ authError: result.message }, { status: 401 });
    }
  }

  // セッションを作成してホームへリダイレクト
  return createUserSession(result.data.user.id, "/");
}

// ログインページコンポーネント
export default function LoginPage(_props: Route.ComponentProps) {
  const actionData = useActionData<typeof action>();
  const [searchParams] = useSearchParams();

  const errors =
    actionData && "errors" in actionData ? actionData.errors : null;
  const authError =
    actionData && "authError" in actionData ? actionData.authError : null;
  const resetSuccess = searchParams.get("reset") === "success";

  // アラートの決定
  const alert = resetSuccess
    ? {
        type: "success" as const,
        message:
          "パスワードが変更されました。新しいパスワードでログインしてください。",
      }
    : authError
      ? { type: "error" as const, message: authError }
      : undefined;

  return (
    <AuthFormCard
      title="ログイン"
      description="アカウントにログインしてください"
      alert={alert}
      footer={
        <>
          {/* パスワードを忘れた方 */}
          <div className="mb-3">
            <Link
              to="/password-reset"
              className="text-sm text-hig-secondary-label hover:text-hig-blue active:opacity-50 transition-colors"
            >
              パスワードを忘れた方
            </Link>
          </div>

          {/* フッターリンク */}
          <p className="text-sm text-hig-secondary-label">
            アカウントをお持ちでないですか？{" "}
            <Link
              to="/register"
              className="text-hig-blue active:opacity-50 transition-opacity"
            >
              新規登録
            </Link>
          </p>
        </>
      }
    >
      <LoginForm errors={errors} />
    </AuthFormCard>
  );
}

// ErrorBoundary
export { RouteErrorBoundary as ErrorBoundary } from "~/shared/components/RouteErrorBoundary";
