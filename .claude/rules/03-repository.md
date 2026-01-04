---
paths: "**/repository/**/*.ts"
---

# repository/ ルール

## 概要

`repository/` ディレクトリは DB アクセス（Prisma 操作）を担当するレイヤー。データの永続化に関する処理のみを行い、ビジネスロジックは含まない。

---

## 基本方針

1. **Prisma を使用した DB アクセスのみを担当する**
2. **ビジネスロジックを含まない**
3. **シンプルな CRUD 操作を提供する**

---

## ディレクトリ構成

```
app/routes/users/
├── route.tsx
├── schema.ts
├── service/
│   └── user.service.ts
└── repository/
    └── user.repository.ts   # DB アクセス
```

---

## ファイル命名規則

| ファイル名               | 用途                       |
| ------------------------ | -------------------------- |
| `{domain}.repository.ts` | ドメインの DB アクセス処理 |

---

## 許可されるインポート

```typescript
// OK - Prisma クライアントをインポート
import { prisma } from "~/shared/lib/db.server";

// NG - service をインポートしない（逆方向の依存）
import { userService } from "../service/user.service";

// NG - schema をインポートしない（型は Prisma が提供）
import { userSchema } from "../schema";
```

---

## 実装パターン

### 基本的な CRUD 操作

```typescript
// repository/user.repository.ts
import { prisma } from "~/shared/lib/db.server";

// 全件取得
export async function findAll() {
  return prisma.user.findMany();
}

// ID で取得
export async function findById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  });
}

// 条件で取得
export async function findByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

// 作成
export async function create(data: { email: string; name: string | null }) {
  return prisma.user.create({
    data,
  });
}

// 更新
export async function update(
  id: string,
  data: { email?: string; name?: string | null }
) {
  return prisma.user.update({
    where: { id },
    data,
  });
}

// 削除
export async function remove(id: string) {
  return prisma.user.delete({
    where: { id },
  });
}
```

### リレーションを含む取得

```typescript
export async function findWithRelations(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      posts: true,
      profile: true,
    },
  });
}
```

---

## 関数命名規則

| 操作 | 命名パターン            | 例                     |
| ---- | ----------------------- | ---------------------- |
| 全件 | `findAll`               | `findAll()`            |
| 単一 | `findById`, `findByXxx` | `findByEmail(email)`   |
| 作成 | `create`                | `create(data)`         |
| 更新 | `update`                | `update(id, data)`     |
| 削除 | `remove`                | `remove(id)`           |
| 存在 | `exists`, `existsByXxx` | `existsByEmail(email)` |

---

## 禁止事項

- ビジネスロジックを含まない（バリデーション、変換など）
- service/ をインポートしない（逆方向の依存）
- 複雑なクエリロジックを repository に書かない（必要なら service で処理）
- トランザクション以外で複数の DB 操作を組み合わせない
