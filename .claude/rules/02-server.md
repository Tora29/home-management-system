# server.ts ルール

## 概要

`server.ts` は DB アクセスや外部 API 呼び出しを行うレイヤー。単一ファイルで管理し、ロジックは `services/` に委譲して薄く保つ。

---

## 基本方針

1. **loader / action の実装を担当する**
2. **ビジネスロジックは services/ に委譲する**
3. **単一ファイルで管理する**（分割しない）

---

## 許可されるインポート

```typescript
// OK
import { prisma } from "~/shared/lib/db.server";
import { calculateSummary } from "./services/calculation";
import { transformToDisplay } from "./services/transform";
import type { LoaderData } from "./schema";
import { entitySchema } from "./schema";

// NG - route.tsx をインポートしない（循環参照）
import { loader } from "./route";
```

---

## 実装パターン

### loader の実装

```typescript
import type { Route } from "./+types/route";
import { prisma } from "~/shared/lib/db.server";
import { transformToDisplay } from "./services/transform";

export async function loader({ params }: Route.LoaderArgs) {
  const users = await prisma.user.findMany();
  return { users: users.map(transformToDisplay) };
}
```

### action の実装（単一 intent）

```typescript
import { data, redirect } from "react-router";
import type { Route } from "./+types/route";
import { createUserSchema } from "./schema";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const result = createUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!result.success) {
    return data({ error: result.error.issues[0]?.message }, { status: 400 });
  }

  await prisma.user.create({ data: result.data });
  return redirect("/users");
}
```

### action の実装（複数 intent）

```typescript
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "create":
      return handleCreate(formData);
    case "update":
      return handleUpdate(formData);
    case "delete":
      return handleDelete(formData);
    default:
      throw new Error(`Unknown intent: ${intent}`);
  }
}

// 各ハンドラーは同じファイル内に定義
async function handleCreate(formData: FormData) {
  // ...
}
```

---

## 薄く保つためのパターン

ロジックを `services/` に委譲して、server.ts は薄く保つ。

```typescript
// server.ts - 薄い実装
import { calculateSummary } from "./services/calculation";
import { validateInput } from "./services/validation";
import { buildResponse } from "./services/transform";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  // services でバリデーション
  const input = validateInput(formData);

  // DB 操作
  const user = await prisma.user.create({ data: input });

  // services でレスポンス構築
  return buildResponse(user);
}
```

---

## 禁止事項

- route.tsx をインポートしない（循環参照）
- server.ts を複数ファイルに分割しない
- 純粋なビジネスロジックを server.ts に書かない（services/ に移動）
