import { useState } from "react";
import type { Route } from "./+types/route";
// ショーケースは init-project.sh で選択されたものに置き換えられます
import { HIGShowcase } from "./showcases/HIGShowcase";

export function meta(_args: Route.MetaArgs) {
  return [
    { title: "React Router v7 Template" },
    {
      name: "description",
      content: "React Router v7 テンプレートの開発ガイド",
    },
  ];
}

type Tab = "design" | "router" | "flow";

export default function Home() {
  const [activeTab, setActiveTab] = useState<Tab>("design");

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="mx-auto max-w-4xl">
        {/* ヘッダー */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            React Router v7 Template
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            AI 駆動開発のためのテンプレート
          </p>
          <a
            href="/users"
            className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            CRUD サンプル（Users）→
          </a>
        </header>

        {/* タブ切り替え */}
        <div className="mb-8">
          <div className="flex justify-center gap-2 rounded-xl bg-gray-200 p-1">
            <TabButton
              active={activeTab === "design"}
              onClick={() => setActiveTab("design")}
            >
              デザインシステム
            </TabButton>
            <TabButton
              active={activeTab === "router"}
              onClick={() => setActiveTab("router")}
            >
              React Router 入門
            </TabButton>
            <TabButton
              active={activeTab === "flow"}
              onClick={() => setActiveTab("flow")}
            >
              開発フロー
            </TabButton>
          </div>
        </div>

        {/* コンテンツ */}
        {activeTab === "design" && <HIGShowcase />}
        {activeTab === "router" && <ReactRouterIntro />}
        {activeTab === "flow" && <DevelopmentFlow />}

        {/* フッター */}
        <footer className="mt-16 text-center text-sm text-gray-500">
          <p>
            デザインスキルは{" "}
            <code className="rounded bg-gray-200 px-1">.claude/skills/</code>{" "}
            にあります
          </p>
          <p className="mt-1">
            カラーのカスタマイズは{" "}
            <code className="rounded bg-gray-200 px-1">app/app.css</code>{" "}
            を編集してください
          </p>
        </footer>
      </div>
    </div>
  );
}

// タブボタン
function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-6 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-600 hover:text-gray-900"
      }`}
    >
      {children}
    </button>
  );
}

// React Router 入門コンテンツ
function ReactRouterIntro() {
  return (
    <div className="space-y-8">
      {/* React Router v7 とは */}
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-xl font-bold text-gray-900">
          React Router v7 とは
        </h3>
        <p className="text-gray-600">
          React Router v7 は、React
          アプリケーションのルーティングとデータ取得を統合したフレームワークです。
          サーバーサイドレンダリング（SSR）をデフォルトでサポートし、
          <code className="rounded bg-gray-100 px-1">loader</code> と{" "}
          <code className="rounded bg-gray-100 px-1">action</code>{" "}
          によるデータフローを提供します。
        </p>
        <a
          href="https://reactrouter.com/home"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-blue-600 hover:underline"
        >
          公式ドキュメント →
        </a>
      </section>

      {/* データフロー */}
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-xl font-bold text-gray-900">データフロー</h3>
        <p className="mb-4 text-gray-600">
          React Router v7 では、データの取得と更新が明確に分離されています。
        </p>
        <div className="space-y-4">
          <DataFlowStep
            title="loader（データ取得）"
            description="ページ表示前にサーバーでデータを取得。SEO に有利な SSR を実現。"
            code={`export async function loader({ params }: Route.LoaderArgs) {
  const user = await db.user.findUnique({ where: { id: params.id } });
  if (!user) throw data({ message: "Not found" }, { status: 404 });
  return { user };
}`}
          />
          <DataFlowStep
            title="コンポーネント（UI 表示）"
            description="loader のデータを受け取り、UI をレンダリング。"
            code={`export default function UserPage({ loaderData }: Route.ComponentProps) {
  const { user } = loaderData;
  return <div>{user.name}</div>;
}`}
          />
          <DataFlowStep
            title="action（データ更新）"
            description="フォーム送信を処理し、データを更新。完了後は自動で loader が再実行。"
            code={`export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const name = formData.get("name");
  await db.user.update({ where: { id: 1 }, data: { name } });
  return { success: true };
}`}
          />
        </div>
      </section>

      {/* 型安全性 */}
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-xl font-bold text-gray-900">型安全性</h3>
        <p className="mb-4 text-gray-600">
          React Router v7 は{" "}
          <code className="rounded bg-gray-100 px-1">+types/route.ts</code>{" "}
          を自動生成し、型安全なデータフローを実現します。
        </p>
        <div className="rounded-lg bg-gray-800 p-4 font-mono text-sm">
          <pre className="text-gray-300">
            {`// +types/route.ts（自動生成）から型をインポート
import type { Route } from "./+types/route";

// LoaderArgs, ActionArgs, ComponentProps が型付けされる
export async function loader({ params }: Route.LoaderArgs) {
  // params.id は string 型として推論される
}

export default function Page({ loaderData }: Route.ComponentProps) {
  // loaderData は loader の戻り値の型として推論される
}`}
          </pre>
        </div>
      </section>

      {/* 共有コンポーネント */}
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-xl font-bold text-gray-900">
          共有コンポーネント
        </h3>
        <p className="mb-4 text-gray-600">
          このテンプレートには、汎用的なレイアウトコンポーネントが含まれています。
        </p>
        <div className="space-y-4">
          <SharedComponentCard
            name="PageLayout"
            path="app/shared/components/PageLayout.tsx"
            description="ページ全体のラッパー。背景色、パディング、最大幅を統一。"
            usage={`import { PageLayout } from "~/shared/components/PageLayout";

export default function MyPage() {
  return (
    <PageLayout maxWidth="4xl">
      <h1>コンテンツ</h1>
    </PageLayout>
  );
}`}
          />
          <SharedComponentCard
            name="RouteErrorBoundary"
            path="app/shared/components/RouteErrorBoundary.tsx"
            description="ルートレベルのエラーを表示。loader/action のエラーをキャッチ。"
            usage={`// route.tsx で再エクスポートするだけ！
export { RouteErrorBoundary as ErrorBoundary } from "~/shared/components/RouteErrorBoundary";`}
          />
        </div>
      </section>

      {/* エラーハンドリング */}
      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-xl font-bold text-gray-900">
          エラーハンドリング
        </h3>
        <p className="mb-4 text-gray-600">
          React Router v7 では、各ルートに{" "}
          <code className="rounded bg-gray-100 px-1">ErrorBoundary</code>{" "}
          を設定できます。RouteErrorBoundary を再エクスポートするだけで OK。
        </p>
        <div className="rounded-lg bg-gray-800 p-4 font-mono text-sm">
          <pre className="text-gray-300">
            {`// app/routes/users/$id/route.tsx

import { data } from "react-router";
import type { Route } from "./+types/route";

// loader でエラーをスロー
export async function loader({ params }: Route.LoaderArgs) {
  const user = await db.user.findUnique({ where: { id: params.id } });
  if (!user) {
    throw data({ message: "ユーザーが見つかりません" }, { status: 404 });
  }
  return { user };
}

export default function UserPage({ loaderData }: Route.ComponentProps) {
  return <div>{loaderData.user.name}</div>;
}

// これだけ！エラー時は自動で RouteErrorBoundary が表示される
export { RouteErrorBoundary as ErrorBoundary } from "~/shared/components/RouteErrorBoundary";`}
          </pre>
        </div>
      </section>
    </div>
  );
}

// データフローステップ
function DataFlowStep({
  title,
  description,
  code,
}: {
  title: string;
  description: string;
  code: string;
}) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
      <h4 className="font-semibold text-gray-900">{title}</h4>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
      <div className="mt-3 rounded-lg bg-gray-800 p-3 font-mono text-xs">
        <pre className="overflow-x-auto text-gray-300">{code}</pre>
      </div>
    </div>
  );
}

// 共有コンポーネントカード
function SharedComponentCard({
  name,
  path,
  description,
  usage,
}: {
  name: string;
  path: string;
  description: string;
  usage: string;
}) {
  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
      <div className="flex items-center gap-2">
        <h4 className="font-semibold text-gray-900">{name}</h4>
        <code className="text-xs text-gray-500">{path}</code>
      </div>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
      <div className="mt-3 rounded-lg bg-gray-800 p-3 font-mono text-xs">
        <pre className="overflow-x-auto text-gray-300">{usage}</pre>
      </div>
    </div>
  );
}

// 開発フローコンテンツ
function DevelopmentFlow() {
  return (
    <div className="space-y-8">
      {/* 開発フロー */}
      <section>
        <p className="mb-6 text-gray-600">
          以下のコマンドを順番に実行して開発を進めます。
          <br />
          <strong className="text-gray-900">
            各コマンド実行後は rules-compliance-checker
            エージェントでルール準拠を確認してください。
          </strong>
        </p>

        <div className="space-y-4">
          <FlowStep
            step={1}
            title="開発環境の準備"
            commands={[
              {
                name: "/01-create-worktree",
                description: "並行開発用の worktree を作成",
              },
            ]}
          />

          <FlowArrow />

          <FlowStep
            step={2}
            title="機能の実装"
            commands={[
              {
                name: "/02-create-route",
                description: "ルートファイルを作成（コロケーション）",
              },
              {
                name: "/03-refactor-logic",
                description: "ロジックを server/service/schema へ",
              },
              {
                name: "/10-refactor-ui",
                description: "UI コンポーネントを分割",
              },
            ]}
          />

          <FlowArrow />

          <FlowStep
            step={3}
            title="テストの作成"
            commands={[
              {
                name: "/11-generate-vitest",
                description: "ユニットテストを作成",
              },
              { name: "/12-generate-e2e", description: "E2E テストを作成" },
            ]}
          />

          <FlowArrow />

          <FlowStep
            step={4}
            title="ドキュメント・PR"
            commands={[
              {
                name: "/13-generate-design-doc",
                description: "設計書を自動生成",
              },
              {
                name: "/14-create-pr",
                description: "PR を作成してレビュー依頼",
              },
            ]}
          />

          <FlowArrow />

          <FlowStep
            step={5}
            title="クリーンアップ（マージ後）"
            commands={[
              {
                name: "/15-end-dev",
                description: "worktree とブランチを削除",
              },
            ]}
          />
        </div>
      </section>

      {/* ディレクトリ構造 */}
      <section>
        <h3 className="mb-4 text-xl font-bold text-gray-900">
          ディレクトリ構造（コロケーション）
        </h3>
        <p className="mb-4 text-gray-600">
          機能に関連するファイルを同じディレクトリにまとめます。
        </p>
        <div className="rounded-lg bg-gray-800 p-6 font-mono text-sm">
          <pre className="text-gray-300">
            {`app/routes/{feature}/
├── route.tsx          # ルート（loader/action/UI）
├── server.ts          # DBアクセス・外部API
├── service.ts         # ビジネスロジック（純粋関数）
├── schema.ts          # Zodスキーマ + ドメイン型
├── types.ts           # 子コンポーネントのProps型（必要な場合）
├── components/        # 機能固有のUIコンポーネント
│   └── FeatureCard.tsx
└── __tests__/         # テスト
    ├── server.test.ts
    └── service.test.ts`}
          </pre>
        </div>
      </section>
    </div>
  );
}

// フローステップ
function FlowStep({
  step,
  title,
  commands,
}: {
  step: number;
  title: string;
  commands: { name: string; description: string }[];
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
          {step}
        </span>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-2 pl-11">
        {commands.map((cmd) => (
          <div key={cmd.name} className="flex items-start gap-2">
            <code className="shrink-0 rounded bg-gray-100 px-2 py-1 text-sm font-medium text-blue-600">
              {cmd.name}
            </code>
            <span className="text-gray-600">{cmd.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// フロー矢印
function FlowArrow() {
  return (
    <div className="flex justify-center py-2">
      <svg
        className="h-6 w-6 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </div>
  );
}
