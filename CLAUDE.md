# CLAUDE.md

このファイルは、このリポジトリのコードを扱う際のClaude Code (claude.ai/code) へのガイダンスを提供します。
すべての応答は日本語で行います。

## プロジェクト概要

Next.js 15 (App Router) + Feature-Sliced Design (FSD) アーキテクチャを採用した給与管理システムです。

## 基本コマンド

```bash
npm run dev          # 開発サーバー起動
npm run build        # プロダクションビルド
npm run lint         # ESLintチェック
npm run format       # Prettierフォーマット
npm run test         # Vitestでテスト実行
```

## パスエイリアス

- `@/*` は `./src/*` にマッピングされます

## アーキテクチャ

アーキテクチャの詳細は **nextjs-fsd-architect エージェント** に委譲します。
- レイヤー構造: `app → features → entities → shared`
- Server/Client境界、Server Actionsの配置などの詳細ルールはエージェントを参照

## コード編集時の必須チェック

コード編集後は**必ず**以下を実行してください:

1. **nextjs-fsd-architect エージェント実行**
   - アーキテクチャ違反がないかレビュー

2. **コード品質チェック**
   ```bash
   npm run lint
   npm run format
   ```

3. **ランタイムエラーチェック**
   - `npm run dev` でコンソールエラー確認
   - ブラウザコンソールでエラー確認
   - 機能が正しく動作するか検証

## エラー優先度

ビルドエラー > ランタイムエラー > TypeScriptエラー > ESLint警告
