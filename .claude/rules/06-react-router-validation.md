---
paths: "**/routes/**/route.tsx"
---

# React Router バリデーションルール

> zod の詳細な使い方は `.claude/rules/05-zod-validation-ssr.md` を参照

## 基本方針

1. **バリデーションはサーバーサイド（action）で行う**
2. **HTML5 ネイティブバリデーションは使用しない**
3. **エラーメッセージは useActionData で取得して表示する**

---

## フォームの書き方

### required 属性は使用しない

`required` 属性を使用すると、ブラウザ標準のエラーメッセージが表示され、zod のカスタムメッセージが使われない。

```typescript
// Good - required なし、サーバーサイドで検証
<input type="text" name="title" />

// Bad - ブラウザ標準のエラーメッセージが表示される
<input type="text" name="title" required />
```

### onSubmit でモーダルを閉じない

エラー時にモーダルが閉じてしまい、エラーメッセージが表示されない。

```typescript
// Good - onSubmit なし、成功時は redirect で遷移
<Form method="post">

// Bad - エラーメッセージが表示される前にモーダルが閉じる
<Form method="post" onSubmit={onClose}>
```

---

## action でのバリデーション

### safeParse でエラーハンドリング

```typescript
import { data, redirect } from "react-router";
import type { Route } from "./+types/route";
import { createTodoSchema } from "./schema";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const result = createTodoSchema.safeParse({
    title: formData.get("title"),
    priority: formData.get("priority"),
  });

  if (!result.success) {
    // エラーメッセージを返す（リダイレクトしない）
    return data({ error: result.error.issues[0]?.message }, { status: 400 });
  }

  // 成功時はリダイレクト
  await createTodo(result.data);
  return redirect("/todos");
}
```

### 400 ステータスを返す理由

400 ステータスで返すと、React Router は loader の再実行をスキップする。これにより、バリデーションエラー時に不要なデータ再取得を防げる。

---

## エラーメッセージの表示

### パターン1: 単一エラー表示

シンプルなフォームで、最初のエラーのみ表示する場合。

```typescript
// action
if (!result.success) {
  return data({ error: result.error.issues[0]?.message }, { status: 400 });
}
```

```typescript
// コンポーネント
function MyForm() {
  const actionData = useActionData<Route.ActionData>();
  const error = actionData && "error" in actionData ? actionData.error : null;

  return (
    <Form method="post">
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
      <input type="text" name="title" />
      <button type="submit">Submit</button>
    </Form>
  );
}
```

### パターン2: フィールドごとのエラー表示

複数フィールドがあり、各フィールドの下にエラーを表示する場合。

```typescript
// action
if (!result.success) {
  const fieldErrors = result.error.flatten().fieldErrors;
  return data({ errors: fieldErrors }, { status: 400 });
}
```

```typescript
// コンポーネント
function MyForm() {
  const actionData = useActionData<Route.ActionData>();
  const errors = actionData && "errors" in actionData ? actionData.errors : null;

  return (
    <Form method="post">
      <div>
        <label htmlFor="title">タイトル</label>
        <input type="text" id="title" name="title" />
        {errors?.title && (
          <p role="alert" className="text-sm text-red-600">
            {errors.title[0]}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email">メールアドレス</label>
        <input type="email" id="email" name="email" />
        {errors?.email && (
          <p role="alert" className="text-sm text-red-600">
            {errors.email[0]}
          </p>
        )}
      </div>

      <button type="submit">Submit</button>
    </Form>
  );
}
```

### 使い分け

| パターン       | 用途                                       |
| -------------- | ------------------------------------------ |
| 単一エラー表示 | シンプルなフォーム、モーダル内のフォーム   |
| フィールドごと | 複数フィールドのフォーム、ユーザー登録など |

---

## フロー図

```
フォーム送信
    │
    ├─ required 属性あり？
    │   └─ YES → ブラウザがバリデーション → 標準エラー表示（NG）
    │
    └─ required 属性なし？
        └─ YES → サーバーへ送信
                    │
                    ├─ zod バリデーション失敗
                    │   └─ { error: "メッセージ" } を返す（status: 400）
                    │       └─ useActionData で取得 → カスタムエラー表示
                    │
                    └─ zod バリデーション成功
                        └─ redirect() → ページ遷移
```

---

## 禁止事項

- `required`、`minlength`、`maxlength`、`pattern` などの HTML5 バリデーション属性を使用しない
- `onSubmit` でモーダルを閉じない（エラーが表示されなくなる）
- `noValidate` に頼らない（シンプルに属性を使わない方が良い）

---

## エラーハンドリングと ErrorBoundary

### try-catch は不要

React Router v7 では、action/loader 内で throw されたエラーは自動的に `ErrorBoundary` でキャッチされる。

```typescript
// Good - try-catch 不要
export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const result = schema.safeParse({ title: formData.get("title") });
  if (!result.success) {
    return data({ error: result.error.issues[0]?.message }, { status: 400 });
  }

  await createTodo(result.data); // エラーは ErrorBoundary へ
  return redirect("/todos");
}

// Bad - 冗長な try-catch
export async function action({ request }: Route.ActionArgs) {
  try {
    // ...
  } catch (error) {
    return { error: "エラーが発生しました" };
  }
}
```

### エラーの分類

| エラー種別       | 処理方法                                  | 例                 |
| ---------------- | ----------------------------------------- | ------------------ |
| 予期されるエラー | `return data({ error }, { status: 400 })` | バリデーション失敗 |
| HTTP エラー      | `throw data(message, { status })`         | 404 Not Found      |
| 予期しないエラー | そのまま throw                            | DB 障害            |

### ErrorBoundary の実装

各ルートで共通の `RouteErrorBoundary` を再エクスポートする。

```typescript
export { RouteErrorBoundary as ErrorBoundary } from "~/shared/components/RouteErrorBoundary";
```

`RouteErrorBoundary` は内部で `useRouteError()` を使用し、`isRouteErrorResponse` で HTTP エラーとその他のエラーを分岐処理する。カスタムのエラー表示が必要な場合のみ、個別に実装する。

---

## メッセージの管理方針

### エラーメッセージは定数ファイルで管理

| スコープ     | 配置場所                        | 例                        |
| ------------ | ------------------------------- | ------------------------- |
| 機能固有     | `routes/{name}/errorMessage.ts` | バリデーションエラー      |
| システム全体 | `shared/errorMessage.ts`        | HTTP エラー（404, 500等） |

### 機能固有のエラーメッセージ

```typescript
// routes/todo/errorMessage.ts
export const ERROR_MESSAGES = {
  title: {
    required: "タイトルは必須です",
    maxLength: "タイトルは100文字以内で入力してください",
  },
  priority: {
    range: "優先度は1〜5で指定してください",
  },
} as const;
```

```typescript
// routes/todo/schema.ts
import { ERROR_MESSAGES } from "./errorMessage";

export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, ERROR_MESSAGES.title.required)
    .max(100, ERROR_MESSAGES.title.maxLength),
  priority: z.coerce
    .number()
    .min(1, ERROR_MESSAGES.priority.range)
    .max(5, ERROR_MESSAGES.priority.range),
});
```

### システム全体のエラーメッセージ

```typescript
// shared/errorMessage.ts
export const SYSTEM_ERROR_MESSAGES = {
  notFound: "リソースが見つかりません",
  invalidDataFormat: "データ形式が不正です",
  unauthorized: "認証が必要です",
  serverError: "サーバーエラーが発生しました",
} as const;
```

```typescript
// routes/todo/route.tsx または service/todo.service.ts
import { SYSTEM_ERROR_MESSAGES } from "~/shared/errorMessage";

throw new Error(SYSTEM_ERROR_MESSAGES.invalidDataFormat);
```

### DB 検証用メッセージ

DB から取得したデータの検証は開発者向けなので、カスタムメッセージ不要（zod デフォルトで十分）。

### エラー以外のメッセージ

空状態メッセージ等は別ファイルで管理する（例: `emptyMessage.ts`）。
