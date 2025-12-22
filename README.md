# React Router Template

React Router v7 + Tailwind CSS v4 + Prisma のテンプレートプロジェクトです。

**SSR（Server-Side Rendering）** と **SSG（Static Site Generation）** の両方に対応しています。

## Getting Started

> **重要**: クローン後、最初に初期化スクリプトを実行してください。

```bash
# 1. テンプレートをクローン
git clone https://github.com/Tora29/React-Router-Template.git my-project
cd my-project

# 2. 初期化スクリプトを実行（レンダリング方式を選択）
./init-project.sh
```

`init-project.sh` は対話形式でプロジェクトを初期化します：

1. **レンダリング方式の選択** - SSR または SSG
2. **プロジェクト名の設定** - package.json、docker-compose.yml、DB名を一括更新
3. **デザインパターンの選択** - Material Design / Ant Design / HIG / なし
4. **環境構築** - 依存関係インストール、Docker 起動、Prisma スキーマ反映

---

## SSR vs SSG

| 項目         | SSR                                | SSG                                    |
| ------------ | ---------------------------------- | -------------------------------------- |
| レンダリング | リクエスト毎に loader/action 実行  | ビルド時に loader 実行、静的 HTML 生成 |
| 構成         | 単一リポジトリ                     | モノレポ (apps/web + apps/api)         |
| API          | loader/action で直接 DB アクセス   | Express API サーバー                   |
| 用途         | 動的コンテンツ、認証、リアルタイム | ブログ、LP、ドキュメントサイト         |
| 開発サーバー | `npm run dev` → localhost:5173     | `npm run dev` → web:5173 + api:3000    |

---

## アーキテクチャ

### 共通

- UI ライブラリ: React 19
- フレームワーク: React Router v7
- スタイリング: Tailwind CSS v4
- バリデーション: zod
- ORM: Prisma
- アイコン: lucide
- ディレクトリ: コロケーション

### SSR 構成

```
app/
├── routes/{feature}/
│   ├── route.tsx                   # loader/action/UI
│   ├── schema.ts                   # Zod スキーマ
│   ├── service/
│   │   └── {feature}.service.ts    # ビジネスロジック
│   ├── repository/
│   │   └── {feature}.repository.ts # DB操作
│   └── components/                 # UI コンポーネント
└── components/                     # 共通コンポーネント
```

### SSR データフロー

```
┌─────────────────────────────────────────────────────────────────┐
│  Browser                                                        │
└─────────────────────────────────────────────────────────────────┘
          │ Request
          ▼
┌─────────────────────────────────────────────────────────────────┐
│  app/routes/{feature}/                                          │
│                                                                 │
│  ┌─────────────┐   ┌──────────────┐   ┌──────────────┐         │
│  │  route.tsx  │──▶│   service/   │──▶│ repository/  │         │
│  │(loader/action)  │ (ビジネス)   │   │  (DB操作)    │         │
│  └─────────────┘   └──────────────┘   └──────┬───────┘         │
│                                              │                  │
│  ┌─────────────┐                             ▼                  │
│  │  schema.ts  │                      ┌──────────────┐         │
│  │ (Zod + 型)  │                      │    Prisma    │         │
│  └─────────────┘                      └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│  PostgreSQL                                                     │
└─────────────────────────────────────────────────────────────────┘
```

### SSG 構成

```
apps/
├── web/                      # フロントエンド（静的サイト）
│   └── app/
│       ├── routes/{feature}/
│       │   ├── route.tsx     # clientLoader/clientAction/UI
│       │   └── components/   # UI コンポーネント
│       └── components/       # 共通コンポーネント
└── api/                      # バックエンド（Express）
    └── src/
        ├── routes/{feature}/
        │   ├── index.ts                    # ルート定義
        │   ├── controller/
        │   │   └── {feature}.controller.ts # HTTPハンドリング
        │   ├── service/
        │   │   └── {feature}.service.ts    # ビジネスロジック
        │   └── repository/
        │       └── {feature}.repository.ts # DB操作
        └── index.ts          # Express エントリポイント
packages/
└── shared/                   # 共有コード
    └── src/schema/           # Zod スキーマ + 型定義
```

### SSG データフロー

```
┌─────────────────────────────────────────────────────────────────┐
│  Browser                                                        │
└─────────────────────────────────────────────────────────────────┘
          │ fetch("/api/users")
          ▼
┌─────────────────────────────────────────────────────────────────┐
│  apps/web                                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ route.tsx                                                │   │
│  │  • clientLoader: API から取得 → 画面表示                 │   │
│  │  • clientAction: フォーム送信 → API へ POST              │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
          │ HTTP Request
          ▼
┌─────────────────────────────────────────────────────────────────┐
│  apps/api/src/routes/{feature}/                                 │
│                                                                 │
│  ┌───────────┐   ┌─────────────┐   ┌──────────────┐            │
│  │ index.ts  │──▶│ controller/ │──▶│   service/   │            │
│  │ (routing) │   │ (HTTP層)    │   │ (ビジネス)   │            │
│  └───────────┘   └─────────────┘   └──────┬───────┘            │
│                                           │                     │
│                                           ▼                     │
│                                    ┌──────────────┐            │
│                                    │ repository/  │            │
│                                    │ (DB操作)     │            │
│                                    └──────┬───────┘            │
│                                           │                     │
│                                           ▼                     │
│                                    ┌──────────────┐            │
│                                    │    Prisma    │            │
│                                    └──────────────┘            │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│  packages/shared                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ schema/   ← web と api 両方から import                   │   │
│  │  • userSchema, createUserSchema                          │   │
│  │  • type User, CreateUserInput                            │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│  PostgreSQL                                                     │
└─────────────────────────────────────────────────────────────────┘
```

---

## 開発フロー

一機能を開発する際は、以下のスラッシュコマンドを順番に実行します。
初期化時に選択したレンダリング方式によって使用するコマンドが異なります。

### SSR の場合

```
┌─────────────────────────────────────────────────────────────┐
│ 1. 開発環境の準備                                            │
│    /01-create-worktree-ssr → 並行開発用の worktree を作成    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. 機能の実装                                                │
│    /02-create-route-ssr   → ルートファイルを作成             │
│    /03-refactor-logic-ssr → ロジックを server/service/schema へ│
│    /10-refactor-ui        → UI コンポーネントを分割          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. テストの作成                                              │
│    /11-generate-vitest → ユニットテストを作成                │
│    /12-generate-e2e    → E2E テストを作成                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. ドキュメント・PR                                          │
│    /13-generate-design-doc → 設計書を自動生成                │
│    /14-create-pr           → PR を作成してレビュー依頼       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. クリーンアップ（マージ後）                                │
│    /15-end-dev → worktree とブランチを削除                   │
└─────────────────────────────────────────────────────────────┘
```

### SSG の場合

```
┌─────────────────────────────────────────────────────────────┐
│ 1. 開発環境の準備                                            │
│    /01-create-worktree-ssg → 並行開発用の worktree を作成    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. 機能の実装                                                │
│    /02-create-route-ssg     → web 側ルートを作成             │
│    /03-create-api-route-ssg → api 側ハンドラを作成           │
│    /04-refactor-api-ssg     → API ロジックを services/schema へ│
│    /10-refactor-ui          → UI コンポーネントを分割        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. テストの作成                                              │
│    /11-generate-vitest → ユニットテストを作成                │
│    /12-generate-e2e    → E2E テストを作成                    │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. ドキュメント・PR                                          │
│    /13-generate-design-doc → 設計書を自動生成                │
│    /14-create-pr           → PR を作成してレビュー依頼       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. クリーンアップ（マージ後）                                │
│    /15-end-dev → worktree とブランチを削除                   │
└─────────────────────────────────────────────────────────────┘
```

`/99-generate-prompt` はコンテキスト限界時に次回セッションへ引き継ぐプロンプトを作成します。

## コマンド一覧

### SSR

```bash
# 開発
npm run dev          # 開発サーバー起動
npm run build        # ビルド
npm run start        # 本番サーバー起動
npm run typecheck    # 型チェック

# Lint / Format
npm run lint         # ESLint 実行
npm run lint:fix     # ESLint 自動修正
npm run format       # Prettier 実行
npm run format:check # Prettier チェック

# テスト
npm run test           # Vitest（ウォッチモード）
npm run test:run       # Vitest（単発実行）
npm run test:coverage  # カバレッジ付き
npm run test:e2e       # Playwright E2E テスト
npm run test:e2e:ui    # Playwright UI モード
```

### SSG

```bash
# 開発
npm run dev          # web + api 同時起動
npm run dev:web      # フロントエンドのみ起動
npm run dev:api      # API サーバーのみ起動
npm run build        # 全体ビルド
npm run typecheck    # 全体型チェック

# Lint / Format（各ワークスペース共通）
npm run lint         # ESLint 実行
npm run lint:fix     # ESLint 自動修正
npm run format       # Prettier 実行
npm run format:check # Prettier チェック

# テスト
npm run test           # Vitest（ウォッチモード）
npm run test:run       # Vitest（単発実行）
npm run test:coverage  # カバレッジ付き
npm run test:e2e       # Playwright E2E テスト
npm run test:e2e:ui    # Playwright UI モード
```

### DB（共通）

```bash
docker compose up -d     # コンテナ起動
docker compose down      # コンテナ停止
npx prisma db push       # スキーマ反映
npx prisma db seed       # シード実行
npx prisma studio        # Prisma Studio 起動
```

DB 完全初期化:

```bash
docker compose down -v && docker compose up -d && npx prisma db push && npx prisma db seed
```

## 実装ルール

初期化時に選択したレンダリング方式によって、適用されるルールファイルが異なります。

### SSR

- レイヤー依存関係: `.claude/rules/01-layer-dependencies-ssr.md`
- server: `.claude/rules/02-server-ssr.md`
- services: `.claude/rules/03-services-ssr.md`
- schema: `.claude/rules/04-schema-ssr.md`
- zod バリデーション: `.claude/rules/05-zod-validation-ssr.md`
- React Router バリデーション: `.claude/rules/06-react-router-validation-ssr.md`

### SSG

- レイヤー依存関係: `.claude/rules/01-layer-dependencies-ssg.md`
- web 側 loader: `.claude/rules/02-web-server-ssg.md`
- services: `.claude/rules/03-services-ssg.md`
- api 側 handler: `.claude/rules/04-api-handler-ssg.md`
- schema: `.claude/rules/05-schema-ssg.md`
- zod バリデーション: `.claude/rules/06-zod-validation-ssg.md`
- React Router バリデーション: `.claude/rules/07-react-router-validation-ssg.md`

### 共通

- コンポーネント再利用: `.claude/rules/common/component-reuse.md`
- アイコン: `.claude/rules/common/icon-usage.md`
- import 整理: `.claude/rules/common/import-order.md`
- Web 標準: `.claude/rules/common/web-standards.md`
- デザイン: `.claude/skills/{design-pattern}/SKILL.md`

実装後、「ルールに従っているか確認して」と依頼すると、`rules-compliance-checker` エージェントが自動で検証します。

## ライセンス

MIT
