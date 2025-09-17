# create-test

指定されたTypeScript/TSXファイルに対して、テスト基準に従った適切なテストファイルを作成します。

## 使用方法

```
create-test <filepath>
```

## 引数

- `filepath`: テストを作成したい`.ts`または`.tsx`ファイルのパス

## 実行内容

1. **対象ファイルの分析**
   - ファイルの内容を読み取り、コードの種類を判定
   - 純粋関数、クラス、コンポーネント、Server Actionsなどを識別

2. **テスト粒度の決定**
   - A1: 単一メソッド/関数のテスト（純粋関数、ユーティリティ、バリデーション）
   - A2: クラス/コンポーネント単位のテスト（UIコンポーネント、状態管理）
   - A3: モジュール統合テスト（API統合、DB連携）

3. **テストファイルの生成**
   - 対象ファイルと同じディレクトリに`.test.ts`または`.test.tsx`を作成
   - 適切なテスト構造とモックの設定
   - テスト基準に従った包括的なテストケース

## テスト作成基準

### 純粋関数（A1）

```typescript
// 例: src/shared/utils/calculate.ts
describe('calculateFunction', () => {
  describe('正常系', () => {
    it('期待される値を返す', () => {
      // 1つの振る舞いをテスト
    })
  })
  describe('異常系', () => {
    it('エラーハンドリング', () => {
      // エラーケースをテスト
    })
  })
})
```

### UIコンポーネント（A2）

```typescript
// 例: src/features/inventory/ui/Component.tsx
describe('Component', () => {
  it('正しくレンダリングされる', () => {
    // レンダリングテスト
  })
  it('ユーザーインタラクションが動作する', () => {
    // イベントハンドリングテスト
  })
  it('エラー状態を表示する', () => {
    // エラー表示テスト
  })
})
```

### Server Actions（A1 + A2）

```typescript
// 例: src/features/inventory/api/actions.ts
describe('serverAction', () => {
  // A1: 個別関数テスト
  describe('validateData', () => {
    it('正しいデータを検証する', () => {})
  })

  // A2: 統合テスト
  describe('全体フロー', () => {
    it('正常系のフローが動作する', async () => {})
  })
})
```

## テストツール

- **フレームワーク**: Vitest
- **UIテスト**: React Testing Library
- **モック**: vi.mock, vi.fn
- **アサーション**: expect, toBe, toHaveBeenCalled等

## 注意事項

1. **FSDアーキテクチャに準拠**
   - レイヤー間の依存関係を守る
   - 適切なモック戦略を適用

2. **テスト比率の目標**
   - A1: 70%（単一メソッド/関数）
   - A2: 20%（コンポーネント/クラス）
   - A3: 10%（統合テスト）

3. **パフォーマンス**
   - A1: ~1ms（高速実行）
   - A2: ~10ms（中速実行）
   - A3: ~100ms（低速実行）

## 実行例

```bash
# 純粋関数のテスト作成
create-test src/shared/utils/format.ts

# UIコンポーネントのテスト作成
create-test src/features/inventory/ui/ItemCard.tsx

# Server Actionsのテスト作成
create-test src/features/inventory/api/actions.ts
```

## 生成されるテストの品質

- ✅ 全ての公開メソッド/関数をカバー
- ✅ 正常系と異常系の両方をテスト
- ✅ エッジケースを考慮
- ✅ 適切なモック化で高速実行
- ✅ 読みやすく保守しやすい構造
- ✅ テスト基準ドキュメントに準拠
