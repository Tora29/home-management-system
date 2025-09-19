# アーキテクチャルール（Service層対応版）

## 📁 ディレクトリ構造

```
src/
├── app/                  # Next.js App Router（ルーティング）
│   ├── (routes)/         # ルートグループ
│   │   └── [route]/      # 動的ルート
│   │       ├── page.tsx  # ページコンポーネント（RSC）
│   │       ├── layout.tsx # レイアウト
│   │       ├── loading.tsx # ローディングUI
│   │       └── error.tsx # エラーハンドリング
│   ├── layout.tsx        # ルートレイアウト
│   ├── page.tsx          # ホームページ
│   ├── globals.css       # グローバルスタイル
│   └── not-found.tsx     # 404ページ
├── features/             # ビジネス機能
│   └── [feature-name]/
│       ├── ui/           # UI コンポーネント（RSC/Client）
│       ├── model/        # Zod スキーマと型定義
│       │   └── validators.ts # Zod バリデーションスキーマ
│       ├── service/      # ユースケース実装（ビジネスロジック）
│       │   └── [use-case].ts # 'use server'
│       ├── repository/   # Prisma操作の集約
│       │   └── [entity].repository.ts # DBアクセス層
│       └── api/          # I/O層
│           ├── actions.ts  # Server Actions（薄く保つ）
│           └── queries.ts  # データ取得（RSC用）
├── entities/             # ビジネスエンティティ
│   └── [entity-name]/
│       ├── model/        # 型定義のみ
│       ├── api/          # エンティティ固有のデータフェッチ（RSC用）
│       │   └── queries.ts  # ピュアなデータ取得関数
│       └── ui/           # エンティティUI
└── shared/               # 共有コード
    ├── lib/              # ライブラリ設定
    │   ├── prisma.ts     # Prismaクライアント
    │   ├── chakra-provider.tsx # Chakra UIプロバイダー
    │   └── chakra-theme.ts    # Chakra UIテーマ
    ├── utils/            # 汎用ユーティリティ
    │   └── validation/   # バリデーションユーティリティ
    ├── test/             # テストユーティリティ
    │   └── test-utils.tsx # テストヘルパー
    └── consts/           # 定数定義
        └── errorMessage.ts # エラーメッセージ定数
```

## 🎯 Entities層のAPI設計

### Entities API層の責務

- **ピュアなデータフェッチ**: エンティティ固有のCRUD操作
- **Repository呼び出し**: features/api/repositoryを利用
- **ビジネスロジックなし**: 単純な取得・リスト化のみ
- **RSC専用**: Server Componentsから直接呼び出し

### Features vs Entities のAPI分離

- **entities/api/queries.ts**: エンティティの基本的な取得（findAll, findById）
- **features/api/queries.ts**: 複雑なクエリ、複数エンティティの結合
- **features/api/actions.ts**: 更新系操作、Server Actions

## 🏗️ Service層の役割

### Service層の責務

- **ユースケース実装**: ビジネスロジックのオーケストレーション
- **トランザクション管理**: 複数のDB操作の一貫性を保証
- **冪等性制御**: 重複実行を防ぐロジック
- **エラー翻訳**: 技術的エラーをビジネスエラーに変換
- **依存注入**: I/O操作（Repository/API）を注入で受け取る

### Server Actionsの責務（薄く保つ）

- **入力検証**: Zodスキーマによるバリデーション
- **認可**: ユーザー解決とアクセス権限チェック
- **Service呼び出し**: ビジネスロジックの実行
- **キャッシュ制御**: `revalidatePath`/`revalidateTag`
- **リダイレクト**: `redirect`の実行
- **CRUD/Prisma直叩きは禁止**: 必ずRepository経由

## 📐 層構造と依存方向

### 基本ルール

- レイヤー階層: **app → features → entities → shared**
- 依存方向は上位から下位へ（例: app が features を参照）
- 下位から上位への import は禁止
- 同一層内での cross-import も禁止

### features層内の依存方向

```
ui → service → repository
ui → model/validators（検証のみ）
service → repository（依存OK）
repository → service（禁止）
api → service → repository（階層順守）
```

### shared/libの扱い

- Prismaクライアントは `shared/lib/prisma.ts` に配置
- Chakra UIの設定は `shared/lib/chakra-*.tsx` に配置
- 全層から参照可能（最下層として扱う）

## 📝 実装例

### 1. Server Action（薄く保つ）

```typescript
// features/inventory/api/actions.ts
'use server'

import { createInventorySchema } from '../model/validators'
import { createInventoryItem } from '../service/create-inventory'
import { getCurrentUser } from '@/features/auth/api/queries' // 認証機能実装時
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createInventoryAction(formData: FormData) {
  // 1. 認証・認可
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')

  // 2. 入力検証
  const validated = createInventorySchema.parse({
    name: formData.get('name'),
    quantity: formData.get('quantity'),
  })

  // 3. Service呼び出し
  const result = await createInventoryItem({
    ...validated,
    userId: user.id,
  })

  // 4. キャッシュ制御
  revalidatePath('/inventory')

  // 5. リダイレクト
  redirect(`/inventory/${result.id}`)
}
```

### 2. Service層（ビジネスロジック）

```typescript
// features/inventory/service/create-inventory.ts
'use server'

import { prisma } from '@/shared/lib/prisma'
import { inventoryRepository } from '../repository/inventory.repository'
import type { CreateInventoryInput } from '../model/validators'

export async function createInventoryItem(input: CreateInventoryInput) {
  // トランザクション管理
  return await prisma.$transaction(async (tx) => {
    // 冪等性チェック
    const existing = await inventoryRepository.findByName(input.name, tx)
    if (existing) {
      throw new Error('Item already exists')
    }

    // ビジネスロジック
    const calculatedPrice = calculatePrice(input)

    // Repository経由でDB操作
    const item = await inventoryRepository.create(
      {
        ...input,
        price: calculatedPrice,
      },
      tx,
    )

    // 関連エンティティの更新
    await updateRelatedEntities(item.id, tx)

    return item
  })
}
```

### 3. Repository層（DB操作）

```typescript
// features/inventory/repository/inventory.repository.ts
import type { PrismaClient } from '@prisma/client'
import { prisma } from '@/shared/lib/prisma'

export const inventoryRepository = {
  findByName: (name: string, tx?: PrismaClient) => {
    const client = tx || prisma
    return client.inventory.findFirst({
      where: { name },
    })
  },

  create: (data: any, tx?: PrismaClient) => {
    const client = tx || prisma
    return client.inventory.create({ data })
  },
}
```

### 4. Zodスキーマ（model層）

```typescript
// features/inventory/model/validators.ts
import { z } from 'zod'

export const createInventorySchema = z.object({
  name: z.string().min(1).max(100),
  quantity: z.number().positive(),
  categoryId: z.string().uuid(),
})

export type CreateInventoryInput = z.infer<typeof createInventorySchema>
```

## 🎯 設計上の原則

1. **Service層の配置**
   - `features/[feature]/service/` に配置（api/と同階層）
   - api/service/のような入れ子は避ける

2. **model層の用途**
   - Zodスキーマの定義場所として使用
   - 型定義も同じ場所に配置してよい

3. **server-only明示**
   - サーバー専用コードには必ず `'use server'` を付与
   - クライアントへの誤importを防止

4. **キャッシュ制御の責務**
   - `revalidatePath`/`revalidateTag` はAction側で実行
   - Service層からは呼び出さない

## 🧪 テスト戦略

### 層別テスト方針

1. **lib層**: 純粋関数のユニットテスト
2. **service層**: 依存をモック化した結合テスト（トランザクション境界含む）
3. **api/repository層**: スキーマ契約テスト
4. **actions層**: ハッピーパス/エラーパスの最小限確認

### テスト優先度

- Service層 > Repository層 > Actions層 > UI層
- ビジネスロジックのテストを最優先

## ⚠️ よくある違反パターン

### ❌ アンチパターン

```typescript
// Server ActionでDB直接操作（禁止）
export async function badAction() {
  const item = await prisma.inventory.create({ ... }) // NG
}

// Service層からキャッシュ制御（禁止）
export async function badService() {
  await createItem()
  revalidatePath('/inventory') // NG: Actionで行う
}

// repository層からservice層を参照（禁止）
// repository/inventory.repository.ts
import { validateBusiness } from '../service/validator' // NG
```

### ✅ 正しいパターン

```typescript
// Repository経由でDB操作
export async function goodAction() {
  const item = await inventoryRepository.create({ ... }) // OK
}

// キャッシュ制御はAction側
export async function goodAction() {
  await createItemService()
  revalidatePath('/inventory') // OK: Action内で実行
}

// service層からrepository層を参照
// service/create-item.ts
import { inventoryRepository } from '../repository/inventory.repository' // OK
```

## 📋 チェックリスト

### 実装時の確認事項

- [ ] Server Actionsは薄く保たれているか
- [ ] ビジネスロジックはService層に集約されているか
- [ ] DB操作はRepository経由になっているか
- [ ] 入力検証はmodel/validators.tsのZodスキーマを使用しているか
- [ ] キャッシュ制御はAction側で行っているか
- [ ] 依存方向が正しいか（ui → service → repository）
- [ ] server-onlyが適切に明示されているか
- [ ] トランザクション境界が適切に設定されているか

## まとめ

- **Server Actions**: I/Oの入り口として薄く保つ
- **Service層**: ビジネスロジックを集約
- **Repository層**: DB操作を抽象化
- **model層**: Zodスキーマによる検証を集約
- **依存方向**: ui → service → repository
- **キャッシュ制御**: Action側で実施
- **テスト**: Service層を中心に実装
