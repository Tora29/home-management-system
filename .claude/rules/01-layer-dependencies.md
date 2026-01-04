# レイヤー依存関係ルール

## 基本方針

各ファイルの責務を明確に分離し、依存関係を単方向に保つ。

---

## 依存関係の流れ

```
route.tsx → service/* → repository/* → schema.ts
    ↓           ↓            ↓
  UI層    ビジネスロジック  DBアクセス
```

---

## 各レイヤーの責務

| ファイル       | 責務                             | 詳細ルール                       |
| -------------- | -------------------------------- | -------------------------------- |
| `route.tsx`    | UI 描画、loader/action の公開    | -                                |
| `service/*`    | ビジネスロジック、バリデーション | `.claude/rules/02-service.md`    |
| `repository/*` | DB アクセス（Prisma 操作）       | `.claude/rules/03-repository.md` |
| `schema.ts`    | zod スキーマ、型定義             | `.claude/rules/04-schema.md`     |

---

## 共有ユーティリティの扱い

`~/shared/` 配下のユーティリティは、どのレイヤーからもインポート可能。

```typescript
// 全レイヤーで OK
import { formatCurrency } from "~/shared/utils/format";
import { hashPassword } from "~/shared/lib/password.server";
```

---

## 禁止事項

- `route.tsx` から `repository/` を直接インポートしない
- `repository/` から `service/` をインポートしない（逆方向の依存）
- `service/` 内のファイル同士で相互インポートしない
- 循環参照を作らない
- 再エクスポート（re-export）を使わない

---

## 判断フローチャート

```
新しい関数を追加したい
    │
    ├─ DB アクセス（Prisma 操作）のみ？
    │   └─ YES → repository/ に追加
    │
    ├─ ビジネスロジック（バリデーション、変換、計算）？
    │   └─ YES → service/ に追加
    │
    ├─ 型やスキーマの定義？
    │   └─ YES → schema.ts に追加
    │
    └─ UI に関係する？
        └─ YES → route.tsx または components/ に追加
```
