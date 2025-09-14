# 設計書: 在庫アイテム登録機能

## 1. 要件概要

- Issue: #3 在庫アイテム登録機能
- 概要: 在庫アイテムの新規登録機能を実装。アイテム名、数量、単位、カテゴリ、保管場所、賞味期限、最小在庫数、備考を入力可能にする
- 優先度: 高
- 想定工数: 8時間

## 2. 技術設計

### 2.1 アーキテクチャレイヤー

影響を受けるFSDレイヤーとその理由：

- **app層**: 新規ページ `/inventory/register/page.tsx` の追加
- **features層**: 在庫登録機能の実装 (`inventory-registration` feature)
- **entities層**: アイテム、カテゴリ、単位、保管場所の型定義
- **shared層**: フォームコンポーネント、バリデーションユーティリティ

### 2.2 ディレクトリ構造

```
src/
├── app/
│   └── inventory/
│       └── register/
│           └── page.tsx              # 在庫登録ページ
├── features/
│   └── inventory-registration/
│       ├── api/
│       │   ├── actions.ts           # Server Actions
│       │   └── queries.ts           # データ取得（マスタデータ）
│       ├── model/
│       │   └── index.ts             # 機能固有の型定義
│       └── ui/
│           └── ItemRegistrationForm.tsx    # 登録フォーム（ビジネスロジック統合）
├── entities/
│   └── inventory/
│       ├── model/
│       │   ├── item.ts              # Item型定義
│       │   ├── category.ts          # Category型定義
│       │   ├── unit.ts              # Unit型定義
│       │   ├── location.ts          # Location型定義
│       │   └── index.ts             # 型定義のエクスポート
│       └── ui/
│           ├── ItemFormFields.tsx   # アイテム入力フィールド群
│           ├── StockManagementFields.tsx  # 在庫管理フィールド群
│           └── CategoryLocationFields.tsx # カテゴリ・保管場所フィールド群
└── shared/
    └── utils/
        └── validation/
            └── item.ts               # バリデーションルール
```

### 2.3 データモデル

#### entities/inventory/model/item.ts

```typescript
export type Item = {
  id: string
  name: string
  description?: string | null
  quantity: number
  unit: string
  minimumStock?: number | null
  maximumStock?: number | null
  location?: string | null
  expiryDate?: Date | null
  barcode?: string | null
  notes?: string | null
  imageUrl?: string | null
  categoryId: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export type CreateItemInput = {
  name: string
  description?: string
  quantity: number
  unit: string
  minimumStock?: number
  maximumStock?: number
  location?: string
  expiryDate?: string // ISO 8601形式
  barcode?: string
  notes?: string
  categoryId: string
}
```

#### entities/inventory/model/category.ts

```typescript
export type Category = {
  id: string
  name: string
  description?: string | null
  icon?: string | null
  color?: string | null
  sortOrder: number
  isActive: boolean
}
```

#### entities/inventory/model/unit.ts

```typescript
export type Unit = {
  id: string
  name: string
  displayName: string
  sortOrder: number
  isActive: boolean
}
```

#### entities/inventory/model/location.ts

```typescript
export type Location = {
  id: string
  name: string
  displayName: string
  description?: string | null
  sortOrder: number
  isActive: boolean
}
```

### 2.4 Server Actions

#### features/inventory-registration/api/actions.ts

```typescript
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import prisma from '@/shared/lib/prisma'
import { CreateItemInput } from '@/entities/inventory/model'
import { validateItemInput } from '@/shared/utils/validation/item'

export async function createItemAction(formData: FormData) {
  try {
    // フォームデータを抽出
    const input: CreateItemInput = {
      name: formData.get('name') as string,
      description: (formData.get('description') as string) || undefined,
      quantity: parseFloat(formData.get('quantity') as string),
      unit: formData.get('unit') as string,
      minimumStock: formData.get('minimumStock')
        ? parseFloat(formData.get('minimumStock') as string)
        : undefined,
      maximumStock: formData.get('maximumStock')
        ? parseFloat(formData.get('maximumStock') as string)
        : undefined,
      location: (formData.get('location') as string) || undefined,
      expiryDate: (formData.get('expiryDate') as string) || undefined,
      barcode: (formData.get('barcode') as string) || undefined,
      notes: (formData.get('notes') as string) || undefined,
      categoryId: formData.get('categoryId') as string,
    }

    // バリデーション
    const validation = validateItemInput(input)
    if (!validation.success) {
      return {
        success: false,
        errors: validation.errors,
      }
    }

    // データベースに保存
    const item = await prisma.item.create({
      data: {
        ...input,
        expiryDate: input.expiryDate ? new Date(input.expiryDate) : undefined,
      },
    })

    // 在庫履歴を記録
    await prisma.itemHistory.create({
      data: {
        itemId: item.id,
        action: 'ADD',
        quantity: item.quantity,
        unit: item.unit,
        afterValue: item.quantity,
        reason: 'Initial registration',
      },
    })

    // キャッシュを再検証
    revalidatePath('/inventory')

    // 成功時はリダイレクト
    redirect('/inventory')
  } catch (error) {
    console.error('Failed to create item:', error)
    return {
      success: false,
      error: 'アイテムの登録に失敗しました',
    }
  }
}
```

#### features/inventory-registration/api/queries.ts

```typescript
import prisma from '@/shared/lib/prisma'
import { Category, Unit, Location } from '@/entities/inventory/model'

export async function getActiveCategories(): Promise<Category[]> {
  return await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })
}

export async function getActiveUnits(): Promise<Unit[]> {
  return await prisma.unit.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })
}

export async function getActiveLocations(): Promise<Location[]> {
  return await prisma.location.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })
}

export async function getMasterData() {
  const [categories, units, locations] = await Promise.all([
    getActiveCategories(),
    getActiveUnits(),
    getActiveLocations(),
  ])

  return { categories, units, locations }
}
```

#### entities/inventory/model/index.ts

```typescript
export type { Item, CreateItemInput } from './item'
export type { Category } from './category'
export type { Unit } from './unit'
export type { Location } from './location'
```

### 2.5 UIコンポーネント

#### entities/inventory/ui/ItemFormFields.tsx

```typescript
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  Select,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { Unit } from '../model';

type Props = {
  units: Unit[];
}

export function ItemFormFields({ units }: Props) {
  return (
    <>
      <FormControl isRequired>
        <FormLabel>アイテム名</FormLabel>
        <Input
          name="name"
          placeholder="例: トイレットペーパー"
        />
      </FormControl>

      <FormControl>
        <FormLabel>説明</FormLabel>
        <Textarea
          name="description"
          placeholder="アイテムの説明（任意）"
        />
      </FormControl>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <FormControl isRequired>
            <FormLabel>数量</FormLabel>
            <NumberInput min={0} precision={2}>
              <NumberInputField name="quantity" placeholder="0" />
            </NumberInput>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isRequired>
            <FormLabel>単位</FormLabel>
            <Select name="unit" required>
              <option value="">選択してください</option>
              {units.map(unit => (
                <option key={unit.id} value={unit.name}>
                  {unit.displayName}
                </option>
              ))}
            </Select>
          </FormControl>
        </GridItem>
      </Grid>
    </>
  );
}
```

#### entities/inventory/ui/CategoryLocationFields.tsx

```typescript
import {
  FormControl,
  FormLabel,
  Select
} from '@chakra-ui/react';
import { Category, Location } from '../model';

type Props = {
  categories: Category[];
  locations: Location[];
}

export function CategoryLocationFields({ categories, locations }: Props) {
  return (
    <>
      <FormControl isRequired>
        <FormLabel>カテゴリ</FormLabel>
        <Select name="categoryId" required>
          <option value="">選択してください</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>保管場所</FormLabel>
        <Select name="location">
          <option value="">選択してください</option>
          {locations.map(location => (
            <option key={location.id} value={location.name}>
              {location.displayName}
            </option>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
```

#### features/inventory-registration/ui/ItemRegistrationForm.tsx

```typescript
import { createItemAction } from '../api/actions';
import { Category, Unit, Location } from '@/entities/inventory/model';
import { ItemFormFields } from '@/entities/inventory/ui/ItemFormFields';
import { CategoryLocationFields } from '@/entities/inventory/ui/CategoryLocationFields';
import { StockManagementFields } from '@/entities/inventory/ui/StockManagementFields';
import {
  Button,
  HStack,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Textarea
} from '@chakra-ui/react';

type Props = {
  categories: Category[];
  units: Unit[];
  locations: Location[];
}

export function ItemRegistrationForm({ categories, units, locations }: Props) {
  return (
    <form action={createItemAction}>
      <VStack spacing={8} align="stretch">
        {/* 基本情報 */}
        <VStack spacing={4} align="stretch">
          <Heading size="md">基本情報</Heading>
          <ItemFormFields units={units} />
        </VStack>

        {/* カテゴリ・保管場所 */}
        <VStack spacing={4} align="stretch">
          <Heading size="md">分類・保管</Heading>
          <CategoryLocationFields
            categories={categories}
            locations={locations}
          />
        </VStack>

        {/* 在庫管理 */}
        <VStack spacing={4} align="stretch">
          <Heading size="md">在庫管理</Heading>
          <StockManagementFields />
        </VStack>

        {/* 備考 */}
        <VStack spacing={4} align="stretch">
          <Heading size="md">その他</Heading>
          <FormControl>
            <FormLabel>備考</FormLabel>
            <Textarea
              name="notes"
              placeholder="メモ・注意事項など"
              rows={3}
            />
          </FormControl>
        </VStack>

        <HStack spacing={4} justify="flex-end">
          <Button as="a" href="/inventory" variant="outline">
            キャンセル
          </Button>
          <Button type="submit" colorScheme="blue">
            登録
          </Button>
        </HStack>
      </VStack>
    </form>
  );
}
```

## 3. 実装詳細

### 3.1 Featuresレイヤー

#### 主要な実装ポイント

1. **Server Actions**: `createItemAction`でフォーム送信を処理
2. **データ取得**: `getMasterData`でカテゴリ、単位、保管場所のマスタデータを取得
3. **UIコンポーネント**: `ItemRegistrationForm`でentities/uiのコンポーネントを組み合わせてビジネスロジックを統合
4. **バリデーション**: サーバーサイドでの入力値検証

### 3.2 Entitiesレイヤー

#### 型定義とUIコンポーネント

- inventoryドメインとして統合管理
- Item、Category、Unit、Locationの型定義
- ビジネスロジックは含まない（FSDルールに従う）
- UIコンポーネント：
  - `ItemFormFields`: 基本情報入力フィールド群
  - `CategoryLocationFields`: カテゴリ・保管場所選択フィールド
  - `StockManagementFields`: 在庫管理関連フィールド
  - プレゼンテーショナルコンポーネントとして実装（ビジネスロジックなし）

### 3.3 Sharedレイヤー

#### バリデーションユーティリティ

```typescript
// shared/utils/validation/item.ts
import { CreateItemInput } from '@/entities/inventory/model'

export function validateItemInput(input: CreateItemInput) {
  const errors: Record<string, string> = {}

  // 必須項目のチェック
  if (!input.name || input.name.trim() === '') {
    errors.name = 'アイテム名は必須です'
  }

  if (input.quantity == null || input.quantity < 0) {
    errors.quantity = '数量は0以上の数値を入力してください'
  }

  if (!input.unit) {
    errors.unit = '単位は必須です'
  }

  if (!input.categoryId) {
    errors.categoryId = 'カテゴリは必須です'
  }

  // 在庫数の整合性チェック
  if (input.minimumStock != null && input.maximumStock != null) {
    if (input.minimumStock > input.maximumStock) {
      errors.stock = '最小在庫数は最大在庫数以下にしてください'
    }
  }

  // 賞味期限の妥当性チェック
  if (input.expiryDate) {
    const expiry = new Date(input.expiryDate)
    if (expiry < new Date()) {
      errors.expiryDate = '賞味期限は未来の日付を設定してください'
    }
  }

  return {
    success: Object.keys(errors).length === 0,
    errors,
  }
}
```

## 4. エラーハンドリング

### 4.1 バリデーションエラー

- クライアントサイド: HTML5のバリデーション属性（required、min、max等）
- サーバーサイド: `validateItemInput`関数で詳細な検証
- エラー表示: フォーム上部にエラーメッセージを表示

### 4.2 データベースエラー

- Prismaエラーをキャッチしてユーザーフレンドリーなメッセージに変換
- 重複エラー、外部キー制約違反などを適切に処理
- エラーログをサーバーサイドに記録

### 4.3 ネットワークエラー

- タイムアウト処理の実装
- リトライ機能の検討（将来的な拡張）

## 5. テスト計画

### 5.1 単体テスト

- バリデーション関数のテスト
- 型定義の整合性テスト

### 5.2 統合テスト

- Server Actionsの動作確認
- データベースへの保存確認
- 履歴記録の確認

### 5.3 E2Eテスト

- フォーム入力から登録完了までのフロー
- エラーケースの動作確認
- マスタデータの表示確認

### 5.4 手動テスト項目

1. 全必須項目を入力して登録が成功すること
2. 必須項目が未入力の場合、適切なエラーメッセージが表示されること
3. 最小在庫数 > 最大在庫数の場合、エラーになること
4. 過去の賞味期限を入力した場合、エラーになること
5. 登録後、在庫一覧画面にリダイレクトされること
6. 在庫履歴が正しく記録されること

## 6. 実装順序

1. **Entitiesレイヤーの型定義とUIコンポーネント**
   - inventoryドメインとして統合した型定義を作成
   - Item、Category、Unit、Locationの型定義
   - 再利用可能なフォームフィールドコンポーネントの作成

2. **Sharedレイヤーのユーティリティ**
   - バリデーション関数の実装

3. **Featuresレイヤーの実装**
   - `queries.ts`: マスタデータ取得関数
   - `actions.ts`: Server Actionの実装
   - `ItemRegistrationForm.tsx`: フォームコンポーネント

4. **Appレイヤーのページ作成**
   - `/inventory/register/page.tsx`の実装
   - マスタデータの取得とフォームコンポーネントの配置

5. **テストの実装**
   - バリデーションテスト
   - Server Actionsのテスト

6. **動作確認とバグ修正**
   - 手動テストの実施
   - エラーハンドリングの確認
   - パフォーマンスの最適化
