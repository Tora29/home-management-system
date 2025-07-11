# CLAUDE.md

このファイルは、このリポジトリのコードを扱う際のClaude Code (claude.ai/code)へのガイダンスを提供します。
全ての回答は日本語で行われます。

## プロジェクト概要

SvelteKit、Prisma、Supabaseで構築されたホーム管理システムです。プロジェクトはRunesが有効化されたSvelte 5を使用し、Feature-Sliced Designアーキテクチャパターンに従っています。

## 開発コマンド

### 基本開発

```bash
npm run dev           # 開発サーバーを起動
npm run build         # 本番用ビルド
npm run preview       # 本番用ビルドをプレビュー
npm run prepare       # SvelteKitの同期（型チェック前に実行）
```

### コード品質 & テスト

```bash
npm run format        # Prettierでコードをフォーマット
npm run lint         # ESLint + Prettierのチェックを実行
npm run check        # TypeScriptとSvelteの型チェック
npm run check:watch  # 型チェックのウォッチモード
npm run test:unit    # Vitestでユニットテスト
npm run test:e2e     # Playwrightでエンドツーエンドテスト
npm run test         # すべてのテストを実行（ユニット + E2E）
```

**重要**: ルートやSvelteKitの設定を変更した場合は、型チェック前に必ず`npm run prepare`を実行してください。

## アーキテクチャ

### ディレクトリ構造

プロジェクトは以下の主要ディレクトリを持つFeature-Sliced Designに従っています：

- `src/entities/` - ビジネスエンティティとドメインモデル
- `src/features/` - 機能モジュール（ユーザーストーリー、ユースケース）
- `src/shared/` - 共有ユーティリティ、コンポーネント、設定
- `src/routes/` - SvelteKitのファイルベースルーティング

### パスエイリアス

`svelte.config.js`でクリーンなインポートのために設定されています：

- `entities` → `./src/entities`
- `features` → `./src/features`
- `shared` → `./src/shared`

インポートでこれらのエイリアスを使用してください：`import { supabase } from 'shared/supabase'`

### 技術スタック

- **SvelteKit 2.22.0** with **Svelte 5.0** (Runes有効)
- **Prisma 6.11.1** PostgreSQLのORMとして
- **Supabase 2.50.5** データベースホスティングと認証
- **TypeScript** strictモード
- **Vite** ビルドツール

## データベース & データレイヤー

### Prisma設定

- スキーマの場所：`prisma/schema.prisma`
- データベース：Supabase経由のPostgreSQL
- 現在のモデル：User（基本フィールド：id、email、name、timestamps）

### Supabase設定

- クライアントは`src/shared/supabase.ts`で設定
- 環境変数：`PUBLIC_SUPABASE_URL`と`PUBLIC_SUPABASE_ANON_KEY`
- `.env.example`を`.env`にコピーしてSupabaseの認証情報を追加

## テスト

### ユニットテスト（Vitest）

- Playwright統合によるブラウザ環境テスト
- `vitest-browser-svelte`でのコンポーネントテスト
- テストは`.spec.ts`または`.test.ts`拡張子を使用
- 例：`src/routes/page.svelte.test.ts`

### E2Eテスト（Playwright）

- テストは`e2e/`ディレクトリに配置
- ポート4173でビルドされたアプリケーションに対してテストを実行
- E2Eテストには`.test.ts`拡張子を使用

## 主要な設定ノート

### SvelteKit設定

- **Svelte 5 Runes有効**（svelte.config.jsで`runes: true`）
- デプロイメントの柔軟性のため`@sveltejs/adapter-auto`を使用
- クリーンなインポートのためのカスタムパスエイリアス設定

### コード品質

- TypeScriptとSvelteサポート付きESLint
- フォーマット用Prettier
- ESLintのモダンなフラット設定形式
- TypeScript互換性のため`no-undef`ルールを無効化

### TypeScript

- strictモード有効
- ESM interopとJSONモジュール解決
- デバッグ用のソースマップ有効
- バンドラーモジュール解決

## 開発ワークフロー

1. **開始前**：環境変数が設定されていることを確認
2. **型チェック**：`npm run check`の前に`npm run prepare`を実行
3. **テスト**：コンポーネントのユニットテスト、ユーザーフローのE2Eテスト
4. **コード品質**：コミット前に`npm run lint`と`npm run format`を使用
5. **アーキテクチャ**：Feature-Sliced Designに従い、適切なディレクトリにコードを配置

## 実装ルール

- anyの不使用
- 適切なJSDocを日本語で記述
- Svelte5の記法に準拠する
- npm run lintを最後に実施する
- npm run checkを最後に実施する
- <style>タグは使用せず、スタイルは全てTailwindで表現すること
