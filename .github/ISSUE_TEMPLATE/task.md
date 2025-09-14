---
name: タスク
about: 家の在庫管理システムの実装タスク
title: ''
labels: ''
assignees: ''
---

## 📋 概要
<!-- タスクの概要を簡潔に記述してください -->

## 🎯 ユーザーストーリー
**As a** [ユーザーの種類]
**I want to** [実現したいこと]
**So that** [価値・目的]

## ✅ 受け入れ基準
- [ ] 基準1
- [ ] 基準2
- [ ] 基準3

## 🧪 TDDテスト要件

### Red Phase（失敗するテストを書く）
```typescript
// テストファイルパス: src/features/[feature-name]/__tests__/[test-name].test.ts
describe('機能名', () => {
  it('期待する動作', () => {
    // Arrange
    // Act
    // Assert
  });
});
```

### Green Phase（テストを通す最小実装）
- [ ] 最小限のコードでテストを通す
- [ ] リファクタリングは後回し

### Refactor Phase（リファクタリング）
- [ ] コードの重複を除去
- [ ] 可読性の向上
- [ ] パフォーマンス最適化

## 🏗️ 実装チェックリスト

### 1. テスト作成
- [ ] ユニットテスト作成
- [ ] 統合テスト作成（必要に応じて）
- [ ] E2Eテスト作成（必要に応じて）

### 2. 実装
- [ ] TypeScript型定義
- [ ] ビジネスロジック実装
- [ ] UI実装（必要に応じて）
- [ ] Server Actions実装（必要に応じて）

### 3. 品質チェック
- [ ] `npm run lint`が通る
- [ ] `npm run build`が成功する
- [ ] テストカバレッジ80%以上

## 🔧 技術仕様

### アーキテクチャ層（FSD準拠）
- **依存方向**: app → features → entities → shared
- **配置先**: `src/[layer]/[module-name]/`

### ファイル構成
```
src/features/[feature-name]/
├── api/
│   ├── actions.ts    # Server Actions ('use server')
│   ├── queries.ts    # データ取得 (RSC用)
│   └── client.ts     # Client API calls
├── hooks/            # Custom hooks
├── model/
│   └── types.ts      # 型定義のみ
├── ui/               # Feature UI components
│   └── [component].tsx
└── __tests__/
    └── [test].test.ts

src/entities/[entity-name]/
├── model/            # 型定義のみ
│   └── types.ts
└── ui/              # Entity UI components
    └── [component].tsx
```

### 重要なルール
- **page.tsx**は`features/ui`と`features/api/queries`のみ参照可
- **Server Actions**は`features/api/actions.ts`に配置（entitiesには置かない）
- **Form**の`action`属性にはServer Actionのみ渡す（クライアント関数は不可）
- **entities/ui**はsharedを組み合わせたドメイン固有UI
- **Client Component**はServer Componentをimportできない

### データベース（必要な場合）
```sql
-- Supabaseテーブル定義
```

## 📝 備考
<!-- 追加の注意事項やメモ -->

## 🔗 関連Issue/PR
- #