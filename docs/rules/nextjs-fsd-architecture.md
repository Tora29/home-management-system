# Next.js 15 + Feature-Sliced Design アーキテクチャ設計思想

**最終更新:** 2025-10-07
**対象:** Next.js 15 (App Router) + TypeScript + Feature-Sliced Design

---

## 🎯 設計思想の核心

このプロジェクトは、**スケーラビリティ**と**保守性**を最優先とし、Feature-Sliced Design（FSD）アーキテクチャをNext.js 15のApp Routerと組み合わせた設計を採用しています。

### 基本原則

1. **機能単位での分割**: 技術層ではなく、ビジネス機能ごとにコードを整理
2. **明確な依存方向**: 上位層のみが下位層に依存する単方向の依存関係
3. **Server-First思考**: デフォルトはServer Component、必要な場合のみClient Component
4. **型安全性**: TypeScript strict modeによる完全な型安全性

---

## 📁 ディレクトリ構造

```
src/
├── app/                    # Next.js App Router（ルーティング専用）
│   ├── (routes)/           # ルートグループ
│   │   └── [route]/
│   │       ├── page.tsx    # ページコンポーネント
│   │       ├── layout.tsx  # レイアウト
│   │       ├── loading.tsx # ローディングUI
│   │       └── error.tsx   # エラーハンドリング
│   ├── api/                # Route Handlers
│   ├── layout.tsx          # ルートレイアウト
│   ├── page.tsx            # ホームページ
│   └── globals.css         # グローバルスタイル
│
├── features/               # ビジネス機能層
│   └── [feature-name]/
│       ├── api/
│       │   ├── actions.ts  # Server Actions（ミューテーション）
│       │   ├── queries.ts  # データ取得（RSC用）
│       │   └── client.ts   # クライアントサイドAPI（オプション）
│       ├── hooks/          # カスタムフック
│       ├── model/          # 型定義のみ
│       └── ui/             # 機能UI コンポーネント
│
├── entities/               # ビジネスエンティティ層
│   └── [entity-name]/
│       ├── model/          # 型定義のみ
│       └── ui/             # エンティティUI コンポーネント
│
└── shared/                 # 共有層
    ├── components/ui/      # UIプリミティブ（Button, Input等）
    ├── lib/               # ライブラリ（prisma, utils等）
    ├── utils/             # ユーティリティ関数
    ├── types/             # 共有型定義
    └── consts/            # 定数
```

---

## 🔄 依存関係のルール

### レイヤー階層

```
app → features → entities → shared
```

### 重要な制約

1. **上位層は下位層を参照できる** ✅

   ```tsx
   // app/page.tsx
   import { FeatureUI } from '@/features/inventory/ui' // ✅
   import { Button } from '@/shared/components/ui' // ✅
   ```

2. **下位層は上位層を参照できない** ❌

   ```tsx
   // shared/lib/utils.ts
   import { Something } from '@/features/...' // ❌ 禁止
   ```

3. **同一層内の横断的importは禁止** ❌
   ```tsx
   // features/inventory/ui/ComponentA.tsx
   import { ComponentB } from '@/features/salary/ui' // ❌ 禁止
   ```

---

## 🎨 各層の責務

### App Layer（`app/`）

**責務:** ルーティングとページ構成のみ

```tsx
// app/(routes)/inventory/page.tsx
import { getInventoryItems } from '@/features/inventory/api/queries'
import { InventoryList } from '@/features/inventory/ui'

export default async function InventoryPage() {
  const items = await getInventoryItems()
  return <InventoryList items={items} />
}
```

**許可される参照:**

- `features/ui`: UI コンポーネント
- `features/api/queries`: データ取得関数
- ❌ `features/api/actions`: Server Actionは直接参照しない（UIコンポーネント経由）

### Features Layer（`features/`）

**責務:** ビジネス機能の実装

#### `api/actions.ts` - Server Actions

```tsx
'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/shared/lib/prisma'

export async function createInventoryItem(formData: FormData) {
  // ミューテーション処理
  await db.inventoryItem.create({ ... })

  // 再検証
  revalidatePath('/inventory')
}
```

**ルール:**

- ファイル先頭に `'use server'` 必須
- Client Componentで使う場合は別ファイルで定義してimport
- ミューテーション後の `revalidatePath` / `redirect` はここで実行

#### `api/queries.ts` - データ取得

```tsx
import { db } from '@/shared/lib/prisma'

export async function getInventoryItems() {
  return await db.inventoryItem.findMany({ ... })
}
```

**ルール:**

- Server Component（RSC）専用
- キャッシュ戦略は必要に応じて設定

#### `ui/` - UI コンポーネント

```tsx
// features/inventory/ui/InventoryRegister.tsx
'use client'

import { createInventoryItem } from '../api/actions'
import { Button } from '@/shared/components/ui'

export function InventoryRegister() {
  return (
    <form action={createInventoryItem}>
      <Button type="submit">登録</Button>
    </form>
  )
}
```

### Entities Layer（`entities/`）

**責務:** ドメインエンティティの表現

#### `model/` - 型定義とバリデーション

Zodスキーマを使用して、型定義とバリデーションを一元管理します。

```tsx
// entities/inventory/model/item.ts
import { z } from 'zod'

// Zodスキーマを定義
export const itemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number(),
  categoryId: z.string(),
})

// スキーマから型を抽出
export type Item = z.infer<typeof itemSchema>
```

**メリット:**

- 単一の情報源（Schema as Single Source of Truth）
- 型定義とバリデーションルールの整合性が保証される
- メンテナンスが容易

#### `ui/` - UI コンポーネント

```tsx
// entities/inventory/ui/InventoryItemCard.tsx
import { Card } from '@/shared/components/ui'
import type { Item } from '../model'

export function InventoryItemCard({ item }: { item: Item }) {
  return <Card>{item.name}</Card>
}
```

**制約:**

- ❌ Server Actionは配置しない
- ✅ UIとモデル定義のみ

### Shared Layer（`shared/`）

**責務:** 汎用的な技術的プリミティブ

```tsx
// shared/components/ui/button.tsx
export function Button({ children, ...props }) {
  return <button {...props}>{children}</button>
}
```

**特徴:**

- ビジネスロジックを持たない
- プロジェクト全体で再利用可能

---

## 🔧 Server/Client コンポーネントの境界管理

### 基本原則

1. **デフォルトはServer Component**
2. **以下の場合のみClient Component (`'use client'`)**:
   - `useState`, `useEffect` 等のフック使用
   - ブラウザAPIの使用
   - イベントハンドラの使用

### 境界の作り方

```tsx
// ✅ 正しい: Server Component側で境界を作成
// page.tsx (Server Component)
export default function Page() {
  return (
    <div>
      <ServerComponent />
      <ClientComponent /> {/* Client Componentを埋め込む */}
    </div>
  )
}

// ❌ 間違い: Client ComponentからServer Componentをimport
;('use client')
import ServerComponent from './server' // これは不可能
```

### Server Action の安全な使用

```tsx
// ✅ 別ファイルで定義
// features/inventory/api/actions.ts
'use server'
export async function createItem(data: FormData) { ... }

// features/inventory/ui/Form.tsx
'use client'
import { createItem } from '../api/actions'  // ✅ これはOK

export function Form() {
  return <form action={createItem}>...</form>
}
```

---

## 📝 Form ハンドリングのパターン

### パターン1: サーバー処理（推奨）

```tsx
<form action={serverAction}>
  <input name="title" />
  <button type="submit">送信</button>
</form>
```

**利点:**

- JavaScriptが無効でも動作
- SEO フレンドリー
- サーバー側で完結

### パターン2: クライアント制御

```tsx
'use client'

export function Form() {
  const [errors, setErrors] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    // バリデーション
    if (!isValid) {
      setErrors(...)
      return
    }
    // Server Action呼び出し
    await serverAction(data)
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

**使用ケース:**

- リアルタイムバリデーション
- 複雑なクライアント制御

**重要:** `action` には必ずServer Action、`onSubmit` にはクライアント関数

---

## 🎯 Import の使い分け

### entities/ui の使い分け

```tsx
// features/inventory/ui/InventoryList.tsx

// ✅ 推奨: entities経由
import { InventoryItemCard } from '@/entities/inventory/ui'

// ✅ 許可: 軽量なshared プリミティブは直接OK
import { Button, Stack } from '@/shared/components/ui'

// ❌ 非推奨: 複雑なshared コンポーネントは避ける
import { ComplexTable } from '@/shared/components/ui' // entities化を検討
```

### 判断基準

| 状況                         | 推奨レイヤー           |
| ---------------------------- | ---------------------- |
| 汎用的なボタン、入力欄       | `shared/components/ui` |
| ドメイン固有のカード、リスト | `entities/ui`          |
| 機能全体のフォーム、画面     | `features/ui`          |

---

## 🚀 実装ワークフロー

### 1. 設計フェーズ

```bash
# 機能を feature として整理
features/
└── [new-feature]/
    ├── api/
    ├── model/
    └── ui/
```

### 2. 実装フェーズ

1. **型定義** (`model/`)
2. **Server Actions** (`api/actions.ts`)
3. **データ取得** (`api/queries.ts`)
4. **UI コンポーネント** (`ui/`)
5. **ページ統合** (`app/`)

### 3. 検証フェーズ（重要）

#### エラー優先順位

```
1. ビルドエラー
2. ランタイムエラー
3. TypeScriptエラー
4. ESLint警告
```

#### チェックリスト

- [ ] `npm run dev` でコンソールエラーなし
- [ ] ブラウザコンソールエラーなし
- [ ] 実装した機能が正常動作
- [ ] 500エラー、NEXT_REDIRECT エラーなし
- [ ] Hydration エラーなし
- [ ] `npm run build` 成功
- [ ] `npm run lint` 警告なし

---

## 🛠️ よくある問題と解決策

### 問題1: Module not found

**原因:** import パスが間違っている

**解決:**

```tsx
// ❌
import { Component } from '../../features/...'

// ✅
import { Component } from '@/features/...'
```

### 問題2: Hydration Error

**原因:** Server/Client コンポーネントの境界が不適切

**解決:**

- Server Component内で `'use client'` が必要なコードを使っていないか確認
- Client Component から Server Component を import していないか確認

### 問題3: NEXT_REDIRECT エラー

**原因:** Server Action内のエラーハンドリング不足

**解決:**

```tsx
'use server'
export async function action() {
  try {
    // 処理
    revalidatePath('/path')
  } catch (error) {
    // エラーハンドリング
    return { error: 'エラーメッセージ' }
  }
}
```

### 問題4: 依存関係の循環

**原因:** FSDのレイヤールール違反

**解決:**

- 依存方向を確認: `app → features → entities → shared`
- ESLint / Steiger でチェック

---

## 📚 推奨ツール

### ESLint設定

```bash
npm install -D @feature-sliced/eslint-config
```

```json
// .eslintrc
{
  "extends": ["@feature-sliced"]
}
```

### Steiger（FSD準拠チェック）

```bash
npm install -D steiger
npx steiger src
```

**チェック項目:**

- 依存関係の違反
- 命名規則
- Widget の再利用性
- FSD ベストプラクティス

### server-only パッケージ

```bash
npm install server-only
```

```tsx
// features/inventory/api/queries.ts
import 'server-only'  // このファイルはサーバー専用と明示

export async function getData() { ... }
```

---

## 🎓 学習リソース

- [Feature-Sliced Design 公式](https://feature-sliced.design/)
- [Next.js App Router Guide](https://nextjs.org/docs/app)
- [FSD + Next.js Integration](https://feature-sliced.design/docs/guides/tech/with-nextjs)

---

## 📌 まとめ

### 設計の核心

1. **レイヤーの厳格な分離**: `app → features → entities → shared`
2. **Server-First思考**: デフォルトはServer Component
3. **Server Actions の適切な配置**: `features/api/actions.ts`
4. **境界の明確化**: Server/Client の境界はServer側で管理
5. **実装後の徹底検証**: ランタイムエラーの即座修正

### 成功のポイント

- 機能単位で考える（技術層ではなく）
- 依存方向を常に意識する
- Server/Client の境界を正しく理解する
- 実装後は必ず動作確認する

---

**このアーキテクチャは、スケーラブルで保守性の高いNext.jsアプリケーションを構築するための基盤です。**
