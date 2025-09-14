# アーキテクチャルール（修正版）

## 📁 ディレクトリ構造

```
src/
├── app/                  # Next.js App Router（ルーティング）
│   ├── (routes)/         # ルートグループ
│   │   └── [route]/      # 動的ルート
│   │       ├── page.tsx  # ページコンポーネント
│   │       ├── layout.tsx # レイアウト
│   │       ├── loading.tsx # ローディングUI
│   │       └── error.tsx # エラーハンドリング
│   ├── api/              # Route Handlers (API Routes)
│   │   └── [endpoint]/
│   │       └── route.ts  # GET, POST, PUT, DELETE等
│   ├── layout.tsx        # ルートレイアウト
│   ├── page.tsx          # ホームページ
│   ├── globals.css       # グローバルスタイル
│   └── not-found.tsx     # 404ページ
├── features/             # ビジネス機能
├── entities/             # ビジネスエンティティ
├── shared/               # 共有コード
└── middleware.ts         # Next.js Middleware
```

## 層構造と依存方向

- レイヤーは **app → features → entities → shared**。
- **依存方向**は上位から下位へ（例: app が features を参照する）。
- **import の向きは逆**（下位から上位へ import は禁止）。

## page コンポーネントの責務

- `page.tsx` は以下のみを参照できる：
  - `features/ui`（UI）
  - `features/api/queries`（データ取得／RSC 用）

- データ取得ロジックは `queries` に集約し、`page` から呼び出す。

## Server Action の配置

- **Server Actions** は `features/api/actions` または `app/actions.ts` に集約する。
- `entities` には配置しない（entities は純粋な UI / モデル定義のみ）。
- ミューテーション後は `revalidatePath` や `redirect` を Server Action 側で行う。

## Form の取り扱い

- サーバで処理する場合：

  ```tsx
  import { importSalaryAction } from '../api/actions'
  ;<form action={importSalaryAction}>...</form>
  ```

- クライアントで制御する場合：

  ```tsx
  <form onSubmit={handleSubmit}>...</form>
  ```

- `action` には必ず **Server Action** を渡す。クライアント関数を渡さない。

## shared / entities の使い分け

- **shared**：UI プリミティブ（Button, Stack など）や共通ユーティリティ。
- **entities/ui**：shared を組み合わせた、ドメイン固有の UI。
- **原則**：features/ui → entities/ui 経由で利用。
- **例外**：軽量な shared プリミティブは features/ui から直接利用してよい。

## Server / Client コンポーネントの境界

- **Client Component は Server Component を import できない**。
- Server Component 側で Client Component を埋め込む形にする。
- 「Client から Server を props で渡す」という表現は不可。境界は必ず Server 側で作る。

## まとめ

- **依存方向**を明確に：app → features → entities → shared。
- **page からは queries と UI を参照可**。
- **Server Actions は features/api/actions に集約**。
- **Form の action は Server Action 限定**。
- **shared 直参照は軽量プリミティブに限定**。
- **Server/Client 境界は必ず Server 側で管理**。
