# zod 使用ルール

> **Note**: このルールは zod v4 を対象としています。

## 基本原則

1. **型は `z.infer` で推論する** - 別途 interface/type を定義しない
2. **`safeParse()` を使用する** - `parse()` は try-catch が必要になるため避ける（例外あり、後述）
3. **空文字は valid** - 必須項目には `.min(1)` を付ける

---

## スキーマの種類と命名規則

### 用途別のスキーマ

| 用途                 | 命名パターン        | 例                   |
| -------------------- | ------------------- | -------------------- |
| フォーム入力（作成） | `createXxxSchema`   | `createTodoSchema`   |
| フォーム入力（更新） | `updateXxxSchema`   | `updateTodoSchema`   |
| DB検証・エンティティ | `xxxSchema`         | `todoSchema`         |
| API レスポンス       | `xxxResponseSchema` | `todoResponseSchema` |

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

## formData の扱い

### z.coerce を使用する

formData の値は**全て string** で来るため、数値や日付には `z.coerce` を使用する。

```typescript
// Good - coerce で型変換
const schema = z.object({
  title: z.string().min(1, "タイトルは必須です"),
  amount: z.coerce.number().positive("金額は正の数で入力してください"),
  year: z.coerce.number().min(2000).max(2100),
  date: z.coerce.date(),
});

// Bad - string のまま number を期待
const schema = z.object({
  amount: z.number(), // formData からは "100" (string) が来るのでエラー
});
```

### coerce の動作

| メソッド             | 変換処理          | 例                      |
| -------------------- | ----------------- | ----------------------- |
| `z.coerce.string()`  | `String(input)`   | `42` → `"42"`           |
| `z.coerce.number()`  | `Number(input)`   | `"42"` → `42`           |
| `z.coerce.boolean()` | `Boolean(input)`  | `"true"` → `true`       |
| `z.coerce.date()`    | `new Date(input)` | `"2024-01-01"` → `Date` |

---

## optional / nullable の使い分け

| メソッド      | 許容する値          | 用途                  |
| ------------- | ------------------- | --------------------- |
| `.optional()` | `undefined`         | フォームの任意項目    |
| `.nullable()` | `null`              | DB の NULL 許容カラム |
| `.nullish()`  | `null \| undefined` | 両方許容する場合      |

```typescript
// フォーム入力（任意項目は undefined）
const createUserSchema = z.object({
  name: z.string().min(1),
  nickname: z.string().optional(), // 入力なし = undefined
});

// DB エンティティ（NULL 許容カラム）
const userSchema = z.object({
  name: z.string(),
  deletedAt: z.date().nullable(), // DB の NULL = null
});
```

---

## refine（カスタムバリデーション）

単一フィールドでは表現できない検証ロジックに使用する。

### 基本的な使い方

```typescript
const schema = z.string().refine((val) => val.length <= 100, {
  message: "100文字以内で入力してください",
});
```

### 複数フィールドの関連チェック

```typescript
const dateRangeSchema = z
  .object({
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: "終了日は開始日より後にしてください",
  });
```

### 非同期バリデーション

```typescript
const uniqueEmailSchema = z
  .string()
  .email()
  .refine(
    async (email) => {
      const exists = await checkEmailExists(email);
      return !exists;
    },
    { message: "このメールアドレスは既に使用されています" }
  );

// 非同期の場合は parseAsync / safeParseAsync を使用
await uniqueEmailSchema.safeParseAsync(email);
```

---

## transform（データ変換）

バリデーション後にデータを変換する。

```typescript
// トリムして小文字に変換
const normalizedEmail = z
  .string()
  .email()
  .transform((val) => val.trim().toLowerCase());

// 文字列から配列に変換（カンマ区切り）
const tagsSchema = z
  .string()
  .transform((val) => val.split(",").map((s) => s.trim()));
```

---

## エラーメッセージの書き方

> 詳細は `.claude/rules/06-react-router-validation-ssr.md` の「メッセージの管理方針」を参照

- フォーム検証用（ユーザー向け）: スキーマ内に日本語メッセージを直接書く
- DB 検証用（開発者向け）: カスタムメッセージ不要（zod デフォルトで十分）

---

## よく使うバリデーションパターン

### 文字列

```typescript
// 必須
z.string().min(1, "入力してください");

// 文字数制限
z.string().min(1).max(100, "100文字以内で入力してください");

// メールアドレス
z.string().email("正しいメールアドレスを入力してください");

// URL
z.string().url("正しいURLを入力してください");

// 正規表現（電話番号の例）
z.string().regex(/^0\d{9,10}$/, "正しい電話番号を入力してください");
```

### 数値

```typescript
// formData からの数値（coerce 必須）
z.coerce.number();

// 正の数
z.coerce.number().positive("正の数で入力してください");

// 範囲指定
z.coerce.number().min(1).max(100);

// 整数
z.coerce.number().int("整数で入力してください");
```

### 選択肢

```typescript
// 固定の選択肢
z.enum(["draft", "published", "archived"], {
  errorMap: () => ({ message: "ステータスを選択してください" }),
});

// 数値の選択肢（セレクトボックス等）
z.coerce.number().refine((val) => [1, 2, 3].includes(val), {
  message: "選択肢から選んでください",
});
```

### 日付

```typescript
// formData からの日付（coerce 必須）
z.coerce.date();

// 過去の日付を禁止
z.coerce.date().refine((date) => date >= new Date(), {
  message: "過去の日付は選択できません",
});
```

### チェックボックス

```typescript
// 単一チェックボックス（同意など）
z.literal("on", { errorMap: () => ({ message: "同意が必要です" }) });

// 任意のチェックボックス
z.literal("on").optional();
```

---

## 配列とネストしたオブジェクト

```typescript
// 配列
const todosSchema = z.array(todoSchema);

// 配列の長さチェック
const tagsSchema = z.array(z.string()).min(1, "タグを1つ以上選択してください");

// ネストしたオブジェクト
const userWithTodosSchema = z.object({
  user: userSchema,
  todos: z.array(todoSchema),
});
```

---

## safeParse のパターン

```typescript
const result = schema.safeParse(data);

if (!result.success) {
  // エラー処理
  console.error(result.error.issues);
  return { error: result.error.issues[0]?.message };
}

// 成功時は result.data を使用（型安全）
const validData = result.data;
```

---

## parse() vs safeParse() の使い分け

### 基本は safeParse() を使用

```typescript
// Good - safeParse() で明示的にエラーハンドリング
const result = schema.safeParse(data);
if (!result.success) {
  return data({ error: result.error.issues[0]?.message }, { status: 400 });
}
```

### parse() を使う例外ケース

**ErrorBoundary に処理を委ねる場合**は `parse()` が適切。

```typescript
// OK - DB から取得したデータの検証（失敗は予期しないエラー）
export async function loader({ params }: Route.LoaderArgs) {
  const todo = await getTodo(params.id);
  // 失敗時は ErrorBoundary で処理
  return { todo: todoSchema.parse(todo) };
}
```

| メソッド      | 用途                             |
| ------------- | -------------------------------- |
| `safeParse()` | フォーム入力など予期されるエラー |
| `parse()`     | DB データなど予期しないエラー    |

---

## アンチパターン

### 避けるべきこと

```typescript
// Bad - parse() を try-catch で囲む（safeParse を使うべき）
try {
  const data = schema.parse(input);
} catch (e) {
  // エラー処理
}

// Bad - 型を別途定義
interface Todo {
  id: string;
  title: string;
}
const todoSchema = z.object({
  id: z.string(),
  title: z.string(),
});

// Bad - any を使用
const data: any = schema.parse(input);

// Bad - 空文字チェックなしの必須項目
const schema = z.object({
  title: z.string(), // "" が valid になってしまう
});
```
