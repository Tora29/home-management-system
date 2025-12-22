import { isRouteErrorResponse, useRouteError } from "react-router";
import { PageLayout } from "./PageLayout";

/**
 * 共通のエラーバウンダリコンポーネント
 * ルートで発生したエラーを表示する
 *
 * @example
 * // 各 route.tsx で再エクスポートするだけで使用可能
 * export { RouteErrorBoundary as ErrorBoundary } from "~/shared/components/RouteErrorBoundary";
 */
export function RouteErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <PageLayout>
        <div className="text-center py-12">
          <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">
            {error.status}
          </h1>
          <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
            {error.statusText}
          </p>
          {typeof error.data === "object" &&
            error.data !== null &&
            "message" in error.data && (
              <p className="mt-2 text-gray-500 dark:text-gray-500">
                {String((error.data as { message: unknown }).message)}
              </p>
            )}
          <a
            href="/"
            className="mt-8 inline-block text-blue-600 hover:underline"
          >
            ホームに戻る
          </a>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="text-center py-12">
        <h1 className="text-6xl font-bold text-gray-900 dark:text-gray-100">
          Error
        </h1>
        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400">
          予期しないエラーが発生しました
        </p>
        <a href="/" className="mt-8 inline-block text-blue-600 hover:underline">
          ホームに戻る
        </a>
      </div>
    </PageLayout>
  );
}
