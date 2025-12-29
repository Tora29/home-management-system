# レイヤー依存関係ルール

## 基本方針

各ファイルの責務を明確に分離し、依存関係を単方向に保つ。

---

## 依存関係の流れ

```
route.tsx → server.ts → services/* → schema.ts
    ↓           ↓            ↓
  UI層      loader/action  ビジネスロジック
```

---

## 各レイヤーの責務

| ファイル     | 責務                           | 詳細ルール                         |
| ------------ | ------------------------------ | ---------------------------------- |
| `route.tsx`  | UI 描画、loader/action の公開  | -                                  |
| `server.ts`  | DB アクセス、外部 API 呼び出し | `.claude/rules/02-server-ssr.md`   |
| `services/*` | ビジネスロジック（純粋関数）   | `.claude/rules/03-services-ssr.md` |
| `schema.ts`  | zod スキーマ、型定義           | `.claude/rules/04-schema-ssr.md`   |

---

## 共有ユーティリティの扱い

`~/shared/` 配下のユーティリティは、どのレイヤーからもインポート可能。

```typescript
// 全レイヤーで OK
import { formatCurrency } from "~/shared/utils/format";
```

---

## 禁止事項

- `route.tsx` から `services/` を直接インポートしない
- `services/` から DB や外部 API に依存しない
- `services/` 内のファイル同士で相互インポートしない
- 循環参照を作らない
- 再エクスポート（re-export）を使わない

---

## 判断フローチャート

```
新しい関数を追加したい
    │
    ├─ DB や外部 API にアクセスする？
    │   └─ YES → server.ts に追加
    │
    ├─ 純粋な計算・変換ロジック？
    │   └─ YES → services/ 配下の適切なファイルに追加
    │
    ├─ 型やスキーマの定義？
    │   └─ YES → schema.ts に追加
    │
    └─ UI に関係する？
        └─ YES → route.tsx に追加
```
