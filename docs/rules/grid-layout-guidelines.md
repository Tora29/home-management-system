# Grid レイアウトガイドライン

## 概要

`shared/components/ui/grid.tsx` は Chakra UI をラップした12カラムグリッドシステムです。
このドキュメントでは、FSD アーキテクチャにおける Grid コンポーネントの適切な使用方法を定義します。

## 基本原則

### Grid コンポーネントは全レイヤーで使用可能

`shared` レイヤーのコンポーネントは、上位のすべてのレイヤー（entities、features、app）から使用できます。

```typescript
// ✅ どのレイヤーでもOK
import { Grid, GridItem } from '@/shared/components/ui/grid'
```

## レイヤーごとの責務

### features 層：コレクションのレイアウト

**features は「複数の要素をどう配置するか」を決定する責務を持ちます。**

```typescript
// features/inventory/ui/InventoryList.tsx
import { Grid } from '@/shared/components/ui/grid'
import { InventoryCard } from '@/entities/inventory'

export function InventoryList({ items }) {
  return (
    <Grid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
      {items.map(item => (
        <InventoryCard key={item.id} item={item} />
      ))}
    </Grid>
  )
}
```

**理由：**

- 機能ごとに最適なレイアウトが異なる
- entities は配置方法に依存しない（再利用性が高まる）

### entities 層：単一要素の内部レイアウト

**entities は単一エンティティの内部構造を Grid で構成できます。**

Grid を使うことで、不要な div のネスト（Flex/Stack の入れ子）を排除できます。

```typescript
// entities/inventory/ui/InventoryCard.tsx
import { Grid } from '@/shared/components/ui/grid'
import { Card, Text, Badge } from '@/shared/components/ui'

export function InventoryCard({ item }) {
  return (
    <Card>
      <CardBody>
        <Grid columns={2} gap={4}>
          <Text fontWeight="bold">数量</Text>
          <Text>{item.quantity}</Text>

          <Text fontWeight="bold">カテゴリ</Text>
          <Badge>{item.category}</Badge>
        </Grid>
      </CardBody>
    </Card>
  )
}
```

**重要：entities は配置されるレイアウトを知らない**

```typescript
// ❌ entities 層でグリッドレイアウトを指定しない
<Grid columns={3}>  // これは features の責務
  <InventoryCard />
  <InventoryCard />
  <InventoryCard />
</Grid>
```

## Grid の使い方

### 1. シンプルな均等配置

**均等配置の場合は `columns` プロップを使う（推奨）**

```typescript
// ✅ シンプルで読みやすい
<Grid columns={3} gap={4}>
  <InventoryCard />
  <InventoryCard />
  <InventoryCard />
</Grid>
```

### 2. 12グリッドシステム

**複雑な比率が必要な場合のみ12グリッドを使う**

```typescript
// ✅ 不均等なレイアウトに適している
<Grid gap={4}>  {/* デフォルトで templateColumns='repeat(12, 1fr)' */}
  <GridItem colSpan={8}>
    <MainContent />
  </GridItem>
  <GridItem colSpan={4}>
    <Sidebar />
  </GridItem>
</Grid>
```

### 3. レスポンシブ対応

**オブジェクト記法でブレークポイントごとに指定**

```typescript
// ✅ シンプルな均等配置
<Grid
  columns={{ base: 1, md: 2, lg: 3 }}
  gap={4}
>
  <InventoryCard />
  <InventoryCard />
  <InventoryCard />
</Grid>

// ✅ 12グリッドでの不均等配置
<Grid columns={{ base: 4, md: 8, lg: 12 }} gap={4}>
  <GridItem colSpan={{ base: 4, md: 8, lg: 8 }}>
    <MainContent />
  </GridItem>
  <GridItem colSpan={{ base: 4, md: 8, lg: 4 }}>
    <Sidebar />
  </GridItem>
</Grid>
```

**Chakra UI のブレークポイント：**

- `base`: 0px以上（モバイル）
- `sm`: 640px以上
- `md`: 768px以上（タブレット）
- `lg`: 1024px以上（デスクトップ）
- `xl`: 1280px以上
- `2xl`: 1536px以上

## グリッドのネストに関する注意

### ✅ OK: 独立したグリッド

各 Grid コンポーネントの `columns` は独立しています。

```typescript
// features 層: 3カラムで配置
<Grid columns={3}>
  <InventoryCard />  {/* entities 層のコンポーネント */}
</Grid>

// entities 層: カード内部を2分割
<Card>
  <Grid columns={2}>
    <Text>項目1</Text>
    <Text>項目2</Text>
  </Grid>
</Card>
```

### ⚠️ 注意: 12グリッドのネスト

12グリッドを多段にネストするのは複雑すぎるため避けてください。

```typescript
// ❌ 複雑すぎて保守性が低い
<Grid>  {/* 12グリッド */}
  <GridItem colSpan={4}>
    <Grid>  {/* さらに12グリッド */}
      <GridItem colSpan={6}>...</GridItem>
    </Grid>
  </GridItem>
</Grid>
```

もしこのような構造が必要に感じたら、設計を見直すサインです。

- コンポーネントを分割する
- シンプルな `columns` を使う
- レイアウトを簡略化する

## まとめ

| レイヤー     | 責務                   | Grid の使い方                         |
| ------------ | ---------------------- | ------------------------------------- |
| **features** | コレクションの配置     | `columns` で複数要素を配置            |
| **entities** | 単一要素の内部構造     | `columns` で内部レイアウトを構成      |
| **app**      | ページ全体のレイアウト | セクション分割、メイン+サイドバーなど |

### 使い分けのポイント

- **均等配置** → `columns={3}` などシンプルな指定
- **不均等配置** → 12グリッド (`colSpan` で比率指定)
- **レスポンシブ** → オブジェクト記法でブレークポイント指定
- **Grid vs Flex** → Grid を使えば div のネストを減らせる

### アンチパターン

- ❌ entities 層でコレクションのレイアウトを指定
- ❌ 12グリッドの多段ネスト
- ❌ 均等配置なのに12グリッドを使う
