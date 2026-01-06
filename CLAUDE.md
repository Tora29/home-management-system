# CLAUDE.md

## アーキテクチャ

- UI ライブラリ: React 19
- フレームワーク: React Router v7
- スタイリング: Tailwind CSS v4
- バリデーション: zod v4
- ORM: Prisma
- アイコン: Lucide
- ディレクトリ: コロケーション

## Prisma 開発ワークフロー

- マイグレーションファイルは使用しない
- スキーマ変更時: `prisma/schema/` 内の `.prisma` ファイルを編集 → `npx prisma db push`
- `db push` 実行時に Prisma Client も自動生成される
- シード実行: `npx prisma db seed`
  - シードファイル: `prisma/seeds/` 配下にテーブルごとに作成
  - エントリーポイント: `prisma/seeds/index.ts`
- 命名規則:
  - TypeScript 側: キャメルケース（`baseSalary`）
  - DB 側: スネークケース（`base_salary`）
  - `@map` でマッピング: `baseSalary Int @map("base_salary")`

## DB接続

- コンテナ起動: `docker compose up -d`
- コンテナ停止: `docker compose down`
- psql接続: `docker exec -it home-management-system-db psql -U postgres -d home_management_system`
- DATABASE_URL: `postgresql://postgres:postgres@localhost:5432/home_management_system`
- DB完全初期化:
  ```bash
  docker compose down -v && docker compose up -d && npx prisma db push && npx prisma db seed
  ```

## 実装ルール

- レイヤー依存関係: `.claude/rules/layer-dependencies.md`
- service: `.claude/rules/service.md`
- repository: `.claude/rules/repository.md`
- schema: `.claude/rules/schema.md`
- zod バリデーション: `.claude/rules/zod-validation.md`
- React Router バリデーション: `.claude/rules/react-router-validation.md`
- コンポーネント再利用: `.claude/rules/component-reuse.md`
- アイコン: `.claude/rules/icon-usage.md`
- import 整理: `.claude/rules/import-order.md`
- Web 標準: `.claude/rules/web-standards.md`
- デザイン: `.claude/skills/cyberpunk-design-system/SKILL.md`
- コメントルール: ソースコード上のコメントは日本語で記述する
- 事実と推論を分けること
- 公式ドキュメントのリンクを示すこと
- 実装後は必ず`npm run lint`, `npm run format` を並行実行し確認を行う
