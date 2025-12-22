# schema.ts ルール

## 概要

`schema.ts` は zod スキーマと型定義を配置するファイル。単一ファイルで管理する。

---

## 基本方針

1. **型は `z.infer` で推論する** - 別途 interface/type を定義しない
2. **表示用の型は React Router +types から取得する**
3. **型の二重定義を避ける**

---

## スキーマの種類と命名規則

| 用途                  | 命名パターン        | 例                   |
| --------------------- | ------------------- | -------------------- |
| フォーム入力（作成）  | `createXxxSchema`   | `createTodoSchema`   |
| フォーム入力（更新）  | `updateXxxSchema`   | `updateTodoSchema`   |
| DB 検証・エンティティ | `xxxSchema`         | `todoSchema`         |
| API レスポンス        | `xxxResponseSchema` | `todoResponseSchema` |

### 型の命名

```typescript
// スキーマ
export const todoSchema = z.object({ ... });
export const createTodoSchema = z.object({ ... });

// 型（スキーマから推論）
export type Todo = z.infer<typeof todoSchema>;
export type CreateTodoInput = z.infer<typeof createTodoSchema>;
```

---

## React Router +types の使い方

### loaderData / actionData の型

React Router が自動生成する型を使用する。`as` によるアサーションは使用しない。

```typescript
// Good
export default function Page({ loaderData }: Route.ComponentProps) {
  const { items, query } = loaderData;
}

// Bad - as アサーションは使用しない
export default function Page({ loaderData }: Route.ComponentProps) {
  const { items, query } = loaderData as { items: Item[]; query: string };
}
```

### 子コンポーネント用の型

loaderData から型を抽出する。

```typescript
// loaderData の要素型を取得
type Item = Route.ComponentProps["loaderData"]["items"][number];

// 子コンポーネントで使用
function ItemCard({ item }: { item: Item }) {
  return <div>{item.name}</div>;
}
```

---

## 役割分担

| 用途                     | 使う型                          |
| ------------------------ | ------------------------------- |
| loaderData の型          | React Router +types（自動推論） |
| actionData の型          | React Router +types（自動推論） |
| 子コンポーネントの props | +types から抽出                 |
| action のバリデーション  | zod スキーマ                    |
| サービス関数の引数       | zod から推論した型              |

---

## 許可されるインポート

```typescript
// OK
import { z } from "zod";
import { ERROR_MESSAGES } from "./errorMessage";

// NG - 他のレイヤーに依存しない
import { prisma } from "~/shared/lib/db.server";
import { calculateSummary } from "./services/calculation";
```

---

## components/types.ts の使い方

子コンポーネントの Props 型が多い場合（3 個以上）に `components/types.ts` に分離する。

- **配置場所**: `components/` 配下（コンポーネントの近くに配置）
- **命名規則**: `{ComponentName}Props`

```typescript
// components/types.ts
import type { SalaryRecord } from "../schema";

export type PageHeaderProps = {
  recordsCount: number;
  selectedYear: number | "all";
  onYearChange: (value: string) => void;
};

export type PayslipsTableProps = {
  records: SalaryRecord[];
  onRecordClick: (record: SalaryRecord) => void;
};
```

Props 型が少ない場合（1-2 個）は、コンポーネントファイル内で直接定義しても良い。

---

## 判断フローチャート

```
型が必要
    │
    ├─ loaderData / actionData の型？
    │   └─ YES → Route.ComponentProps から取得
    │
    ├─ 子コンポーネントの props 型？
    │   └─ YES → Route.ComponentProps["loaderData"]["xxx"] から抽出
    │
    ├─ action の入力バリデーション？
    │   └─ YES → zod スキーマ + safeParse
    │
    ├─ サービス関数の引数型？
    │   └─ YES → zod から z.infer で推論
    │
    └─ それ以外 → 都度判断
```

---

## 禁止事項

- `loaderData as SomeType` のような型アサーションは使用しない
- 同じ型を zod と手動で二重定義しない
- 表示用の型（loaderData の要素型）を zod で定義しない
- 他のレイヤー（server.ts, services/）に依存しない
