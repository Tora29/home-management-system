# CLAUDE.md

このファイルは、このリポジトリでコードを扱う際のClaude Code (claude.ai/code)への指針を提供します。
全ての回答は日本語で行われます。

## コマンド

```bash
npm run dev          # Turbopackで開発サーバーを起動
npm run build        # Turbopackで本番用バンドルをビルド
npm run start        # 本番サーバーを起動
npm run lint         # ESLintチェックを実行
```

## アーキテクチャ概要

このプロジェクトはNext.js 15のApp Routerを使用し、Feature-Sliced Design (FSD)アーキテクチャを採用しています。コードベースは関心の分離を維持するため、厳格なレイヤードアーキテクチャルールに従っています。

### レイヤー構造

プロジェクトは厳格な依存階層に従います：
```
app → features → entities → shared
```
- 上位レイヤーは下位レイヤーからインポート可能
- 下位レイヤーは上位レイヤーからインポート不可
- 同一レイヤー内での相互インポートは禁止

### ディレクトリ構造要件

```
src/
├── app/                  # Next.jsルーティングレイヤー
│   ├── (routes)/         # ルートグループ
│   ├── api/              # Route Handlers
│   ├── layout.tsx        # ルートレイアウト
│   ├── page.tsx          # ホームページ
│   └── globals.css       # グローバルスタイル
├── features/             # ビジネス機能
│   └── [feature-name]/
│       ├── api/
│       │   ├── actions.ts  # Server Actions ('use server')
│       │   ├── queries.ts  # データ取得 (RSC用)
│       │   └── client.ts   # クライアントAPI呼び出し
│       ├── hooks/          # カスタムフック
│       ├── model/          # 型定義のみ
│       └── ui/             # 機能UIコンポーネント
├── entities/             # ビジネスエンティティ
│   └── [entity-name]/
│       ├── model/          # 型定義のみ
│       └── ui/             # エンティティUIコンポーネント
└── shared/               # 共有ユーティリティ
    ├── components/ui/      # UIプリミティブ
    ├── lib/               # ライブラリ
    ├── utils/             # ユーティリティ
    └── types/             # 共有型定義
```

### 重要なルール

1. **ページコンポーネントの制限**
   - `page.tsx`は以下からのみインポート可能：
     - `features/ui` （UIコンポーネント用）
     - `features/api/queries` （データ取得用）

2. **Server Actionsの配置**
   - `features/api/actions.ts`または`app/actions.ts`に配置必須
   - `entities`レイヤーには配置禁止
   - 必ず`'use server'`ディレクティブを使用

3. **フォーム処理**
   - サーバーサイド: `<form action={serverAction}>`
   - クライアントサイド: `<form onSubmit={handleSubmit}>`
   - `action`属性にクライアント関数を渡さない

4. **Server/Clientコンポーネント境界**
   - Client ComponentsはServer Componentsをインポート不可
   - 境界は必ずServer側で作成
   - `'use client'`ディレクティブは最小限に、Server Componentsを優先

5. **UIコンポーネント階層**
   - `shared/components/ui`: 基本UIプリミティブ（Button、Input等）
   - `entities/ui`: sharedプリミティブを組み合わせたドメイン固有UI
   - `features/ui`: entities/uiを組み合わせた機能固有UI
   - 軽量なプリミティブはsharedから直接インポート可

## 技術スタック

- **フレームワーク**: Next.js 15.5.2 (App Router)
- **言語**: TypeScript (strictモード)
- **スタイリング**: Tailwind CSS v4
- **ビルドツール**: Turbopack
- **React**: v19.1.0

## MCPサーバー

プロジェクトには3つのMCPサーバーが設定されています：
- **context7**: ドキュメント取得
- **supabase**: データベース操作 (プロジェクト: audmlwmanbwacwxgttgc)
- **github**: リポジトリ操作

## パスエイリアス

- `@/*` は `./src/*` にマップ

## 重要な注意事項

- これはホーム管理システムプロジェクトです
- Feature-Sliced Design (FSD)アーキテクチャを厳格に遵守
- アーキテクチャルールは`.claude/agents/00-Architechture-Rules/FSD-ARCHITECTURE-RULES.md`に文書化
- デフォルトでServer Components、必要時のみClient Components使用
- すべてのミューテーションは適切な再検証を伴うServer Actionsを使用