# services/ ルール

## 概要

ビジネスロジックは `services/` ディレクトリ配下に機能単位で分割する。

---

## ディレクトリ構成

```
app/routes/users/
├── route.tsx
├── server.ts
├── schema.ts
└── services/
    ├── calculation.ts   # 計算ロジック
    ├── validation.ts    # バリデーションロジック
    └── transform.ts     # データ変換ロジック
```

---

## ファイル命名規則

| ファイル名       | 用途                           |
| ---------------- | ------------------------------ |
| `calculation.ts` | 数値計算、集計処理             |
| `validation.ts`  | ビジネスルールのバリデーション |
| `transform.ts`   | データ形式の変換               |
| `filter.ts`      | フィルタリング処理             |
| `sort.ts`        | ソート処理                     |
| `{domain}.ts`    | ドメイン固有のロジック         |

---

## 原則

- 各ファイルは純粋関数のみで構成（副作用なし）
- DB や外部 API に依存しない
- `schema.ts` の型のみインポート可能
- index.ts による再エクスポートは禁止

---

## 許可されるインポート

```typescript
// OK
import type { Entity, SummaryData } from "../schema";

// NG - DB や外部 API に依存しない
import { prisma } from "~/shared/lib/db.server";
import { fetchData } from "../server";

// NG - 他の services ファイルをインポートしない（依存関係の複雑化を防ぐ）
import { calculate } from "./calculation";
```

---

## 判断フローチャート

```
新しい純粋関数を追加したい
    │
    ├─ 計算処理？
    │   └─ YES → calculation.ts
    │
    ├─ データ変換？
    │   └─ YES → transform.ts
    │
    ├─ ビジネスルールのバリデーション？
    │   └─ YES → validation.ts
    │
    ├─ フィルタリング処理？
    │   └─ YES → filter.ts
    │
    ├─ ソート処理？
    │   └─ YES → sort.ts
    │
    └─ その他のドメイン固有ロジック？
        └─ YES → {機能名}.ts を新規作成
```

---

## 禁止事項

- DB や外部 API に依存しない
- 他の services ファイルをインポートしない
- index.ts で再エクスポートしない
- 副作用のある処理を書かない（ログ出力、状態変更等）
