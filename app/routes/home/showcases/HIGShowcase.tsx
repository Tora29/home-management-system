// Human Interface Guidelines ショーケース
export function HIGShowcase() {
  return (
    <div className="space-y-8">
      {/* 概要 */}
      <section className="rounded-xl bg-hig-background p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-hig-label">
          Human Interface Guidelines
        </h2>
        <p className="mt-2 text-hig-secondary-label">
          Apple のデザインシステム。iOS/macOS 風の洗練された UI を構築できる。
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <FeatureTag>Clarity（明快さ）</FeatureTag>
          <FeatureTag>Deference（敬意）</FeatureTag>
          <FeatureTag>Depth（奥行き）</FeatureTag>
          <FeatureTag>SF Symbols</FeatureTag>
        </div>
        <a
          href="https://developer.apple.com/design/human-interface-guidelines/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block text-hig-blue hover:underline"
        >
          公式ドキュメント →
        </a>
      </section>

      {/* ボタン */}
      <section className="rounded-xl bg-hig-background p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-hig-label">ボタン</h3>
        <div className="flex flex-wrap gap-4">
          <button className="min-h-[44px] rounded-xl bg-hig-blue px-5 py-3 text-base font-semibold text-white transition-opacity active:opacity-70">
            Primary
          </button>
          <button className="min-h-[44px] rounded-xl bg-hig-gray5 px-5 py-3 text-base font-semibold text-hig-blue transition-opacity active:opacity-70">
            Secondary
          </button>
          <button className="px-4 py-3 text-base text-hig-blue transition-opacity active:opacity-50">
            Text
          </button>
          <button className="min-h-[44px] rounded-xl bg-hig-red px-5 py-3 text-base font-semibold text-white transition-opacity active:opacity-70">
            Destructive
          </button>
        </div>
      </section>

      {/* カード */}
      <section className="rounded-xl bg-hig-background p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-hig-label">カード</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-hig-background p-4 shadow-md">
            <h4 className="font-semibold text-hig-label">Elevated Card</h4>
            <p className="mt-2 text-sm text-hig-secondary-label">
              シャドウで浮き上がりを表現。メインコンテンツに使用。
            </p>
          </div>
          <div className="rounded-xl bg-hig-secondary-background p-4">
            <h4 className="font-semibold text-hig-label">Grouped Card</h4>
            <p className="mt-2 text-sm text-hig-secondary-label">
              グループ化された設定画面などに使用。
            </p>
          </div>
        </div>
      </section>

      {/* 入力フィールド */}
      <section className="rounded-xl bg-hig-background p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-hig-label">
          入力フィールド
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm text-hig-secondary-label">
              ユーザー名
            </label>
            <input
              type="text"
              placeholder="入力してください"
              className="w-full rounded-lg bg-hig-gray6 px-4 py-3 text-base text-hig-label placeholder:text-hig-gray focus:outline-none focus:ring-2 focus:ring-hig-blue"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-hig-secondary-label">
              検索
            </label>
            <div className="flex items-center gap-2 rounded-lg bg-hig-gray6 px-3 py-2">
              <svg
                className="h-5 w-5 text-hig-gray"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="search"
                placeholder="検索"
                className="flex-1 bg-transparent text-base text-hig-label placeholder:text-hig-gray focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* リスト */}
      <section className="rounded-xl bg-hig-background p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-hig-label">リスト</h3>
        <div className="overflow-hidden rounded-xl bg-hig-secondary-background">
          <div className="bg-hig-background">
            <ListItem
              icon={
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-hig-blue">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                  </svg>
                </div>
              }
              title="アカウント"
              value="example@email.com"
            />
            <ListItem
              icon={
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-hig-red">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
                  </svg>
                </div>
              }
              title="通知"
              value="オン"
            />
            <ListItem
              icon={
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-hig-green">
                  <svg
                    className="h-4 w-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    />
                  </svg>
                </div>
              }
              title="プライバシー"
              last
            />
          </div>
        </div>
      </section>

      {/* カラーパレット */}
      <section className="rounded-xl bg-hig-background p-6 shadow-sm">
        <h3 className="mb-2 text-base font-semibold text-hig-label">
          システムカラー
        </h3>
        <p className="mb-4 text-sm text-hig-secondary-label">
          カスタマイズは app/app.css の --color-hig-* 変数を編集してください
        </p>
        <div className="grid gap-2 sm:grid-cols-5">
          <ColorSwatch color="bg-hig-blue" label="Blue" light />
          <ColorSwatch color="bg-hig-green" label="Green" light />
          <ColorSwatch color="bg-hig-red" label="Red" light />
          <ColorSwatch color="bg-hig-orange" label="Orange" light />
          <ColorSwatch color="bg-hig-yellow" label="Yellow" />
          <ColorSwatch color="bg-hig-teal" label="Teal" />
          <ColorSwatch color="bg-hig-indigo" label="Indigo" light />
          <ColorSwatch color="bg-hig-pink" label="Pink" light />
          <ColorSwatch color="bg-hig-purple" label="Purple" light />
          <ColorSwatch color="bg-hig-gray" label="Gray" light />
        </div>
      </section>
    </div>
  );
}

function FeatureTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-hig-gray5 px-3 py-1 text-xs font-medium text-hig-label">
      {children}
    </span>
  );
}

function ListItem({
  icon,
  title,
  value,
  last = false,
}: {
  icon: React.ReactNode;
  title: string;
  value?: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 ${!last ? "border-b border-hig-separator" : ""} transition-colors active:bg-hig-gray5`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-base text-hig-label">{title}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && (
          <span className="text-base text-hig-secondary-label">{value}</span>
        )}
        <svg
          className="h-4 w-4 text-hig-gray3"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          />
        </svg>
      </div>
    </div>
  );
}

function ColorSwatch({
  color,
  label,
  light = false,
}: {
  color: string;
  label: string;
  light?: boolean;
}) {
  return (
    <div className={`rounded-lg p-3 ${color}`}>
      <span className={`text-xs ${light ? "text-white" : "text-gray-800"}`}>
        {label}
      </span>
    </div>
  );
}
