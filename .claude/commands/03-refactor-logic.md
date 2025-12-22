---
allowed-tools: Read, Write, Edit, Glob, Grep, AskUserQuestion
description: "ルートファイルのロジックをService/Repositoryに分割します"
---

# Custom Command: Refactor to Service/Repository Layer (SSR)

指定されたルートファイル (`routes/{name}/route.tsx`) 内のロジックを、Service/Repository パターンに従って分割してください。

## アーキテクチャ概要

```
route.tsx → service/ → repository/ → Prisma
    ↓          ↓            ↓
loader/action  ビジネス層    データ層
```

## リファクタリング手順

### 1. エラーメッセージファイルの作成

- `routes/{name}/errorMessage.ts` を作成

```typescript
// errorMessage.ts
export const ERROR_MESSAGES = {
  email: {
    required: "メールアドレスは必須です",
    invalid: "有効なメールアドレスを入力してください",
  },
  name: {
    maxLength: "名前は100文字以内で入力してください",
  },
} as const;
```

### 2. スキーマファイルの作成

- `routes/{name}/schema.ts` を作成

```typescript
// schema.ts
import { z } from "zod";
import { ERROR_MESSAGES } from "./errorMessage";

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createUserSchema = z.object({
  email: z.string().email(ERROR_MESSAGES.email.invalid),
  name: z.string().max(100, ERROR_MESSAGES.name.maxLength).optional(),
});

export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
```

### 3. Repository の作成

- `routes/{name}/repository/{name}.repository.ts` を作成
- **Prisma の呼び出しのみ**を行う

```typescript
// repository/user.repository.ts
import { prisma } from "~/shared/lib/db.server";
import type { CreateUserInput, UpdateUserInput } from "../schema";

export async function findAll() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function findById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function create(data: CreateUserInput) {
  return prisma.user.create({
    data: { email: data.email, name: data.name ?? null },
  });
}

export async function update(id: string, data: UpdateUserInput) {
  return prisma.user.update({ where: { id }, data });
}

export async function remove(id: string) {
  return prisma.user.delete({ where: { id } });
}
```

### 4. Service の作成

- `routes/{name}/service/{name}.service.ts` を作成
- **ビジネスロジック**を実装
- Repository を呼び出す
- バリデーション、エラーハンドリングを行う

```typescript
// service/user.service.ts
import { z } from "zod";
import { userSchema, createUserSchema, type User } from "../schema";
import * as userRepository from "../repository/user.repository";

export async function getUsers(): Promise<User[]> {
  const users = await userRepository.findAll();

  const result = z.array(userSchema).safeParse(users);
  if (!result.success) {
    throw new Error("データ形式が不正です");
  }

  return result.data;
}

export async function getUserById(id: string): Promise<User | null> {
  const user = await userRepository.findById(id);
  if (!user) return null;

  const result = userSchema.safeParse(user);
  if (!result.success) {
    throw new Error("データ形式が不正です");
  }

  return result.data;
}

export async function createUser(input: unknown): Promise<User> {
  const result = createUserSchema.safeParse(input);
  if (!result.success) {
    const error = new Error("バリデーションエラー") as Error & {
      details: Record<string, string[]>;
    };
    error.details = result.error.flatten().fieldErrors;
    throw error;
  }

  try {
    return (await userRepository.create(result.data)) as User;
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      throw new Error("このメールアドレスは既に登録されています");
    }
    throw error;
  }
}
// ... updateUser, deleteUser も同様
```

### 5. ルートファイルの修正

- `route.tsx` は loader/action と UI のみに
- Service を呼び出してビジネスロジックを実行

```typescript
// route.tsx
import type { Route } from "./+types/route";
import { data } from "react-router";
import * as userService from "./service/user.service";

export async function loader(_args: Route.LoaderArgs) {
  try {
    const users = await userService.getUsers();
    return { users };
  } catch (error) {
    throw data("データの取得に失敗しました", { status: 500 });
  }
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const rawData = Object.fromEntries(formData);

  try {
    await userService.createUser(rawData);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "バリデーションエラー") {
        const err = error as Error & { details: Record<string, string[]> };
        return { error: error.message, details: err.details };
      }
      return { error: error.message };
    }
    throw data("作成に失敗しました", { status: 500 });
  }
}

export default function UsersPage({ loaderData }: Route.ComponentProps) {
  const { users } = loaderData;
  // ... UI実装
}

export { RouteErrorBoundary as ErrorBoundary } from "~/shared/components/RouteErrorBoundary";
```

## ファイル構成

```
app/routes/{name}/
├── route.tsx                     # loader/action/UI
├── schema.ts                     # Zodスキーマ + 型
├── errorMessage.ts               # エラーメッセージ定数
├── service/
│   └── {name}.service.ts         # ビジネスロジック
├── repository/
│   └── {name}.repository.ts      # DB操作
└── components/                   # UIコンポーネント
```

## 依存関係のルール

```
route.tsx → service → repository → Prisma
    ↓          ↓           ↓
loader/action  ビジネス層   データ層
```

- **route.tsx** は Service のみをインポート
- **Service** は Repository と Schema をインポート
- **Repository** は Prisma と Schema をインポート
- 各レイヤーは下位レイヤーのみに依存

## テスト戦略

| レイヤー | テスト種類 | モック対象 |
|---------|-----------|-----------|
| route.tsx | E2E | なし |
| Service | Unit | Repository |
| Repository | Integration | なし（実DB） |

---

## 実行手順

まず、AskUserQuestion ツールを使ってユーザーに「リファクタリング対象のルートディレクトリを入力してください（例: app/routes/users）」と質問してください。
ユーザーから回答を得てから、上記のルールに従ってリファクタリングを開始してください。
