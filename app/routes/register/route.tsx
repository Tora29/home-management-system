// React・ライブラリ
import { data, Link, useActionData } from "react-router";

// 型定義
import type { Route } from "./+types/route";
import type { FieldErrors } from "~/shared/types/result";

// サービス
import { registerUser } from "./service/register.service";

// 共有コンポーネント
import { createUserSession } from "~/shared/lib/session.server";
import { AuthFormCard } from "~/shared/components/auth";

// ローカルコンポーネント
import { PasswordStrengthIndicator } from "./components/PasswordStrengthIndicator";
import { RegisterForm } from "./components/RegisterForm";

// メタ情報
export function meta(_args: Route.MetaArgs) {
  return [
    { title: "新規登録 - Home Management System" },
    { name: "description", content: "Home Management System に新規登録" },
  ];
}

// action
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const result = await registerUser({
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
    name: formData.get("name"),
  });

  if (!result.success) {
    // validation と duplicate は同じエラー構造
    return data({ errors: result.errors }, { status: 400 });
  }

  // セッションを作成してホームへリダイレクト
  return createUserSession(result.data.userId, "/");
}

// 登録ページコンポーネント
export default function RegisterPage(_props: Route.ComponentProps) {
  const actionData = useActionData<typeof action>();

  const errors: FieldErrors | null =
    actionData && "errors" in actionData ? actionData.errors : null;

  return (
    <AuthFormCard
      title="新規登録"
      description="アカウントを作成してください"
      footer={
        <p className="text-sm text-hig-secondary-label">
          既にアカウントをお持ちですか？{" "}
          <Link
            to="/login"
            className="text-hig-blue active:opacity-50 transition-opacity"
          >
            ログイン
          </Link>
        </p>
      }
    >
      <RegisterForm
        errors={errors}
        renderPasswordStrength={(strength) => (
          <PasswordStrengthIndicator strength={strength} />
        )}
      />
    </AuthFormCard>
  );
}

// ErrorBoundary
export { RouteErrorBoundary as ErrorBoundary } from "~/shared/components/RouteErrorBoundary";
