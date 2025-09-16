# テスト基準ドキュメント

## テスト粒度の定義

### A1: 単一メソッド/関数のテスト
- **定義**: 1つの関数やメソッドの振る舞いのみをテスト
- **特徴**:
  - 依存関係は全てモック化
  - 1つのテストで1つの振る舞いを検証
  - 高速実行（~1ms）
- **推奨割合**: 70%

### A2: クラス/コンポーネント単位のテスト
- **定義**: 複数のメソッドやコンポーネント全体の相互作用をテスト
- **特徴**:
  - 内部の複数機能の連携を検証
  - 一部の依存関係は実装を使用
  - 中速実行（~10ms）
- **推奨割合**: 20%

### A3: モジュール統合テスト
- **定義**: 複数のモジュール間の統合をテスト
- **特徴**:
  - 実際の依存関係を使用
  - E2Eに近い統合テスト
  - 低速実行（~100ms）
- **推奨割合**: 10%

## 現在のテストファイル分類

### 📁 src/entities/inventory/model/item.test.ts
**分類**: A1（単一メソッドテスト）

```typescript
// テスト対象メソッド
- CreateItemSchema.safeParse()
- UpdateItemSchema.safeParse()
- UpdateQuantitySchema.safeParse()
```

**根拠**:
- 各Schemaの`safeParse`メソッドを個別にテスト
- 純粋関数のバリデーションロジックのみを検証
- 外部依存なし

### 📁 src/shared/utils/validation/index.test.ts
**分類**: A1（単一メソッドテスト）

```typescript
// テスト対象メソッド
- validate()
- validators.required()
- validators.minNumber()
- validators.email()
// ...各バリデーター関数
```

**根拠**:
- 各バリデーター関数を独立してテスト
- 純粋関数のみ
- 単一責任の原則に準拠

### 📁 src/features/inventory/api/actions.test.ts
**分類**: A1 + A2のハイブリッド

```typescript
// A1レベル（個別関数テスト）
- processFormData()      // FormData処理
- validateItemData()     // バリデーション
- saveItem()            // DB保存
- recordItemHistory()   // 履歴記録

// A2レベル（統合テスト）
- createItemAction()    // 全体フロー
```

**根拠**:
- 責務を分離して個別テスト可能に設計
- 統合テストも含めて全体の動作を保証
- モックを使用してDB依存を分離

### 📁 src/features/inventory/ui/InventoryRegister.test.tsx
**分類**: A2（コンポーネントテスト）

```typescript
// テスト対象
- InventoryRegisterコンポーネント全体
  - レンダリング
  - フォーム要素の存在確認
  - エラー表示
  - ローディング状態
```

**根拠**:
- UIコンポーネントは複数要素の組み合わせ
- ユーザー視点でのテスト（React Testing Library推奨）
- 個々のDOM要素ではなくコンポーネント全体の振る舞いを検証

### 📁 src/entities/inventory/ui/InventoryItemFormFields.test.tsx
**分類**: A2（コンポーネントテスト）

```typescript
// テスト対象
- InventoryItemFormFieldsコンポーネント全体
  - フォームフィールドのレンダリング
  - name属性の確認
  - エラーメッセージ表示
  - ユーザー入力の受付
```

**根拠**:
- フォームコンポーネントとして全体の振る舞いをテスト
- 複数のフィールド間の整合性を検証
- UIコンポーネントとしてA2が適切

## ベストプラクティス

### 新規テスト作成時の判断基準

#### A1を選択すべき場合
- ✅ 純粋関数のテスト
- ✅ ビジネスロジックのテスト
- ✅ バリデーション関数
- ✅ ユーティリティ関数
- ✅ 計算処理

```typescript
// 例: A1テストの構造
describe('calculateTax', () => {
  describe('消費税10%の場合', () => {
    it('正しく計算される', () => {
      expect(calculateTax(1000, 0.1)).toBe(100)
    })
  })
})
```

#### A2を選択すべき場合
- ✅ UIコンポーネント
- ✅ 状態管理を含むクラス
- ✅ 複数メソッドの連携
- ✅ フォーム全体の動作

```typescript
// 例: A2テストの構造
describe('ShoppingCartComponent', () => {
  it('アイテム追加・削除・合計計算が正しく動作する', () => {
    // コンポーネント全体の振る舞いをテスト
  })
})
```

#### A3を選択すべき場合
- ✅ API統合テスト
- ✅ データベース連携テスト
- ✅ 複数モジュール間の連携
- ✅ E2Eに近いフローテスト

```typescript
// 例: A3テストの構造
describe('在庫管理フロー', () => {
  it('登録から履歴記録まで一連の処理が動作する', async () => {
    // 実際のDBを使用した統合テスト
  })
})
```

## テスト改善の指針

### 現在の状態
```
A1: 60% （目標: 70%）
A2: 40% （目標: 20%）
A3: 0%  （目標: 10%）
```

### 改善アクション
1. **責務の分離**: 大きな関数を小さな単一責任の関数に分割
2. **純粋関数化**: 副作用を持つ関数から純粋関数を抽出
3. **モック戦略**: 適切なモック化で外部依存を分離
4. **統合テスト追加**: 重要なフローにA3テストを追加

## 参考リンク

- [Testing Trophy - Kent C. Dodds](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- [React Testing Library - Best Practices](https://testing-library.com/docs/react-testing-library/intro/)
- [Vitest Documentation](https://vitest.dev/guide/)
- [Feature-Sliced Design Testing](https://feature-sliced.design/docs/guides/examples/testing)

## 更新履歴

- 2025-01-16: 初版作成
- A1/A2/A3の基準定義
- 現在のテストファイル分類
- ベストプラクティスの文書化