---
paths: "**/service/**/*.ts"
---

# service/ ルール

## 概要

`service/` ディレクトリはビジネスロジックを担当するレイヤー。repository を通じて DB にアクセスし、バリデーションや変換処理を行う。

---

## 基本方針

1. **ビジネスロジックを担当する**
2. **DB アクセスは repository/ に委譲する**
3. **バリデーションと型変換を行う**

---

## ディレクトリ構成

```
app/routes/users/
├── route.tsx
├── schema.ts
├── errorMessage.ts
├── service/
│   └── user.service.ts      # ビジネスロジック
└── repository/
    └── user.repository.ts   # DB アクセス
```

---

## ファイル命名規則

| ファイル名            | 用途                       |
| --------------------- | -------------------------- |
| `{domain}.service.ts` | ドメインのビジネスロジック |
| `{feature}.ts`        | 純粋関数（計算、変換など） |

---

## 許可されるインポート

```typescript
// OK - repository をインポート
import * as userRepository from "../repository/user.repository";

// OK - schema から型とスキーマをインポート
import { userSchema, createUserSchema, type User } from "../schema";

// OK - 共有ライブラリをインポート
import { hashPassword } from "~/shared/lib/password.server";

// OK - 共有型をインポート
import type { FieldErrors } from "~/shared/types/result";

// OK - エラーメッセージをインポート
import { ERROR_MESSAGES } from "../errorMessage";

// NG - route.tsx をインポートしない（循環参照）
import { loader } from "../route";

// NG - 他の service ファイルをインポートしない
import { otherService } from "./other.service";
```

---

## 実装パターン

### Result 型による戻り値

Service 関数は Result 型で成功/失敗を表現する。throw ではなく return でエラーを返す。

```typescript
import { z } from "zod";

// 型定義
import type { FieldErrors } from "~/shared/types/result";
import { userSchema, createUserSchema, type User } from "../schema";

// リポジトリ
import * as userRepository from "../repository/user.repository";

// エラーメッセージ
import { ERROR_MESSAGES } from "../errorMessage";

// Result 型の定義（各 service ファイルで定義）
export type CreateUserResult =
  | { success: true; data: { user: User } }
  | { success: false; type: "validation"; errors: FieldErrors }
  | { success: false; type: "duplicate"; errors: FieldErrors };

// 取得処理（失敗は予期しないエラーなので throw）
export async function getUsers(): Promise<User[]> {
  const users = await userRepository.findAll();

  const result = z.array(userSchema).safeParse(users);
  if (!result.success) {
    throw new Error("データ形式が不正です");
  }

  return result.data;
}

// 作成処理（Result 型で返す）
export async function createUser(input: unknown): Promise<CreateUserResult> {
  // バリデーション
  const result = createUserSchema.safeParse(input);
  if (!result.success) {
    return {
      success: false,
      type: "validation",
      errors: result.error.flatten().fieldErrors as FieldErrors,
    };
  }

  // 重複チェック
  const existing = await userRepository.findByEmail(result.data.email);
  if (existing) {
    return {
      success: false,
      type: "duplicate",
      errors: { email: [ERROR_MESSAGES.email.duplicate] },
    };
  }

  // repository に委譲
  const user = (await userRepository.create(result.data)) as User;

  return { success: true, data: { user } };
}
```

### 純粋関数（計算・変換）

```typescript
// service/password.ts - 純粋関数の例
import type { PasswordStrength } from "../schema";

export function calculatePasswordStrength(password: string): PasswordStrength {
  // 純粋な計算ロジック（副作用なし）
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  // ...
  return { score, label: "...", color: "..." };
}
```

---

## route.tsx での使い方

```typescript
// route.tsx
import type { Route } from "./+types/route";
import { data, redirect } from "react-router";
import * as userService from "./service/user.service";

export async function loader() {
  const users = await userService.getUsers();
  return { users };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const result = await userService.createUser({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!result.success) {
    switch (result.type) {
      case "validation":
      case "duplicate":
        return data({ errors: result.errors }, { status: 400 });
    }
  }

  return redirect("/users");
}
```

---

## 禁止事項

- route.tsx をインポートしない（循環参照）
- 他の service ファイルをインポートしない（依存関係の複雑化を防ぐ）
- Prisma を直接使用しない（repository に委譲する）
