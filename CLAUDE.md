# CLAUDE.md

このファイルは、このリポジトリのコードを扱う際のClaude Code (claude.ai/code) へのガイダンスを提供します。
すべての応答は日本語で行われます。

## コマンド

```bash
npm run dev          # 開発サーバーを起動
npm run build        # 本番ビルドを作成
npm run start        # 本番サーバーを起動
npm run lint         # ESLintチェックを実行
npm run test         # Vitestでテストを実行
npm run prisma:studio # Prisma Studioを起動
```

## アーキテクチャ概要

このプロジェクトは、App RouterとFeature-Sliced Design (FSD)アーキテクチャを使用したNext.js 15プロジェクトです。コードベースは、関心事の分離を維持するために厳格なレイヤーアーキテクチャルールに従っています。

### レイヤー構造

プロジェクトは厳格な依存関係の階層に従います：

```
app → features → entities → shared
```

- 上位レイヤーは下位レイヤーからインポート可能
- 下位レイヤーは上位レイヤーからインポート不可
- 同一レイヤー内での相互インポートは禁止

### ディレクトリ構造要件

```
src/
├── app/                  # Next.js App Router（ルーティング）
│   ├── (routes)/         # ルートグループ
│   │   └── [route]/      # 動的ルート
│   │       ├── page.tsx  # ページコンポーネント（RSC）
│   │       ├── layout.tsx # レイアウト
│   │       ├── loading.tsx # ローディングUI
│   │       └── error.tsx # エラーハンドリング
│   ├── layout.tsx        # ルートレイアウト
│   ├── page.tsx          # ホームページ
│   ├── globals.css       # グローバルスタイル
│   └── not-found.tsx     # 404ページ
├── features/             # ビジネス機能
│   └── [feature-name]/
│       ├── ui/           # UI コンポーネント（RSC/Client）
│       ├── model/        # Zod スキーマと型定義
│       │   └── validators.ts # Zod バリデーションスキーマ
│       ├── service/      # ユースケース実装（ビジネスロジック）
│       │   └── [use-case].ts # 'use server'
│       ├── repository/   # Prisma操作の集約
│       │   └── [entity].repository.ts # DBアクセス層
│       └── api/          # I/O層
│           ├── actions.ts  # Server Actions（薄く保つ）
│           └── queries.ts  # データ取得（RSC用）
├── entities/             # ビジネスエンティティ
│   └── [entity-name]/
│       ├── model/        # 型定義のみ
│       ├── api/          # エンティティ固有のデータフェッチ（RSC用）
│       │   └── queries.ts  # ピュアなデータ取得関数
│       └── ui/           # エンティティUI
└── shared/               # 共有コード
    ├── lib/              # ライブラリ設定
    │   ├── prisma.ts     # Prismaクライアント
    │   ├── chakra-provider.tsx # Chakra UIプロバイダー
    │   └── chakra-theme.ts    # Chakra UIテーマ
    ├── utils/            # 汎用ユーティリティ
    │   └── validation/   # バリデーションユーティリティ
    ├── test/             # テストユーティリティ
    │   └── test-utils.tsx # テストヘルパー
    └── consts/           # 定数定義
        └── errorMessage.ts # エラーメッセージ定数
```

### 重要なルール

1. **ページコンポーネントの制限**
   - `page.tsx`は以下からのみインポート可能：
     - UIコンポーネント用の`features/ui`
     - データ取得用の`features/api/queries`

2. **サーバーアクションの配置**
   - `features/api/actions.ts`または`app/actions.ts`に配置する必要がある
   - `entities`レイヤーには配置しない
   - 常に`'use server'`ディレクティブを使用

3. **フォーム処理**
   - サーバーサイド: `<form action={serverAction}>`
   - クライアントサイド: `<form onSubmit={handleSubmit}>`
   - `action`属性にクライアント関数を渡さない

4. **サーバー/クライアントコンポーネントの境界**
   - クライアントコンポーネントはサーバーコンポーネントをインポートできない
   - 境界はサーバー側で作成する必要がある
   - `'use client'`ディレクティブは控えめに使用し、サーバーコンポーネントを優先

5. **UIコンポーネント階層**
   - `shared/components/ui`: 基本的なUIプリミティブ（Button、Inputなど）
   - `entities/ui`: ドメイン固有のUIのために共有プリミティブを組み合わせる
   - `features/ui`: 機能固有のUIのためにentities/uiを組み合わせる
   - 軽量なプリミティブはsharedから直接インポート可能

## 技術スタック

- **フレームワーク**: Next.js 15.5.2 (App Router使用)
- **言語**: TypeScript (strictモード)
- **UIライブラリ**: Chakra UI v3
- **スタイリング**: Emotion (Chakra UIに統合)
- **React**: v19.1.0
- **データベース**: Prisma ORM + Vercel Postgres
- **テストツール**: Vitest

## MCPサーバー

プロジェクトは3つのMCPサーバーで構成されています：

- **context7**: ドキュメント取得
- **github**: リポジトリ操作

## パスエイリアス

- `@/*`は`./src/*`にマッピング

## 品質保証

### ランタイムエラー処理

実装後は常に以下を確認し、ランタイムエラーを即座に修正してください：

1. **開発サーバーのチェック**
   - `npm run dev`実行中のコンソールでエラーを確認
   - ブラウザコンソールでエラーを確認
   - 500エラー、NEXT_REDIRECTエラーなどを確認

2. **一般的なランタイムエラーと解決策**
   - `Module not found`: インポートパスとモジュールの存在を確認
   - `Hydration error`: サーバー/クライアントコンポーネントの境界を確認
   - `NEXT_REDIRECT`: サーバーアクションのエラー処理を確認
   - `Type error`: TypeScript定義と実行時の値の一貫性を確認

3. **修正優先度**
   - ビルドエラー > ランタイムエラー > TypeScriptエラー > ESLint警告

4. **テスト手順**
   - 実装した機能が正しく動作することを確認
   - エラーが発生した場合、エラーメッセージを読んで原因を特定
   - 修正後は常に機能を再検証

## 重要な注意事項

- これは家庭管理システムプロジェクトです
- Feature-Sliced Design (FSD)アーキテクチャに厳格に従います
- アーキテクチャルールは`.claude/agents/00-Architechture-Rules/FSD-ARCHITECTURE-RULES.md`に文書化されています
- デフォルトでサーバーコンポーネントを使用し、必要な場合のみクライアントコンポーネントを使用
- すべてのミューテーションは適切な再検証を伴うサーバーアクションを使用する必要があります
- **実装後は常にランタイムエラーを確認し、発見した場合は修正してください**
