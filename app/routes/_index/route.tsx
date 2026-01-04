// React・ライブラリ
import { redirect } from "react-router";

// 共有コンポーネント
import { RouteErrorBoundary } from "~/shared/components/RouteErrorBoundary";

// ホームルートは login にリダイレクト
export function loader() {
  return redirect("/login");
}

// エラーバウンダリ
export { RouteErrorBoundary as ErrorBoundary };
