---
name: human-interface-guidelines
description: Apple Human Interface Guidelines (HIG) に基づいた UI デザインガイド。カラーシステム、タイポグラフィ、コンポーネント、スペーシングの実装。iOS/macOS 風 UI 作成、コンポーネント設計、Apple プラットフォーム向けデザイン時に使用。
---

# Apple Human Interface Guidelines スタイルガイド

Tailwind CSS で Apple Human Interface Guidelines（HIG）の原則に沿った UI を実装するためのガイド。

## このスキルを使用するタイミング

- iOS/macOS 風の UI コンポーネントを作成するとき
- Apple プラットフォーム向けのデザインを検討するとき
- SF Pro フォントやシステムカラーを使用するとき
- ブラー効果やバイブランシーを実装するとき
- アクセシビリティに配慮した Apple 風 UI を構築するとき

---

## コアコンセプト

### Human Interface Guidelines の設計原則

1. **Clarity（明快さ）**: テキストは読みやすく、アイコンは明確、装飾は控えめで機能に焦点
2. **Deference（コンテンツへの敬意）**: UI はコンテンツを引き立て、競合しない
3. **Depth（奥行き）**: 視覚的なレイヤーと動きで階層と文脈を伝える

### 主な特徴

- **システムカラー**: ライト/ダークモード自動対応
- **SF Pro フォント**: Apple のシステムフォント
- **Dynamic Type**: ユーザー設定に応じたテキストサイズ
- **SF Symbols**: 2,500+ のシステムアイコン
- **Vibrancy**: 半透明とブラー効果

---

## カラーシステム

### システムカラー

```css
:root {
  /* System Blue */
  --hig-blue: #007aff;
  --hig-blue-dark: #0a84ff;

  /* System Green */
  --hig-green: #34c759;
  --hig-green-dark: #30d158;

  /* System Red */
  --hig-red: #ff3b30;
  --hig-red-dark: #ff453a;

  /* System Orange */
  --hig-orange: #ff9500;
  --hig-orange-dark: #ff9f0a;

  /* System Yellow */
  --hig-yellow: #ffcc00;
  --hig-yellow-dark: #ffd60a;

  /* System Teal */
  --hig-teal: #5ac8fa;
  --hig-teal-dark: #64d2ff;

  /* System Indigo */
  --hig-indigo: #5856d6;
  --hig-indigo-dark: #5e5ce6;

  /* System Pink */
  --hig-pink: #ff2d55;
  --hig-pink-dark: #ff375f;

  /* System Purple */
  --hig-purple: #af52de;
  --hig-purple-dark: #bf5af2;

  /* Grayscale */
  --hig-gray: #8e8e93;
  --hig-gray2: #aeaeb2;
  --hig-gray3: #c7c7cc;
  --hig-gray4: #d1d1d6;
  --hig-gray5: #e5e5ea;
  --hig-gray6: #f2f2f7;

  /* セマンティックカラー - ライトモード */
  --hig-label: #000000;
  --hig-secondary-label: rgba(60, 60, 67, 0.6);
  --hig-tertiary-label: rgba(60, 60, 67, 0.3);
  --hig-quaternary-label: rgba(60, 60, 67, 0.18);
  --hig-placeholder: rgba(60, 60, 67, 0.3);

  /* 背景色 - ライトモード */
  --hig-system-background: #ffffff;
  --hig-secondary-system-background: #f2f2f7;
  --hig-tertiary-system-background: #ffffff;
  --hig-grouped-background: #f2f2f7;
  --hig-secondary-grouped-background: #ffffff;

  /* 区切り線 */
  --hig-separator: rgba(60, 60, 67, 0.29);
  --hig-opaque-separator: #c6c6c8;
}
```

### ダークモードカラー

```css
@media (prefers-color-scheme: dark) {
  :root {
    /* セマンティックカラー - ダークモード */
    --hig-label: #ffffff;
    --hig-secondary-label: rgba(235, 235, 245, 0.6);
    --hig-tertiary-label: rgba(235, 235, 245, 0.3);
    --hig-quaternary-label: rgba(235, 235, 245, 0.18);
    --hig-placeholder: rgba(235, 235, 245, 0.3);

    /* 背景色 - ダークモード */
    --hig-system-background: #000000;
    --hig-secondary-system-background: #1c1c1e;
    --hig-tertiary-system-background: #2c2c2e;
    --hig-grouped-background: #000000;
    --hig-secondary-grouped-background: #1c1c1e;

    /* 区切り線 */
    --hig-separator: rgba(84, 84, 88, 0.6);
    --hig-opaque-separator: #38383a;
  }
}
```

### Tailwind 拡張設定

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        // システムカラー
        "hig-blue": "var(--hig-blue)",
        "hig-green": "var(--hig-green)",
        "hig-red": "var(--hig-red)",
        "hig-orange": "var(--hig-orange)",
        "hig-yellow": "var(--hig-yellow)",
        "hig-teal": "var(--hig-teal)",
        "hig-indigo": "var(--hig-indigo)",
        "hig-pink": "var(--hig-pink)",
        "hig-purple": "var(--hig-purple)",

        // グレースケール
        "hig-gray": {
          DEFAULT: "var(--hig-gray)",
          2: "var(--hig-gray2)",
          3: "var(--hig-gray3)",
          4: "var(--hig-gray4)",
          5: "var(--hig-gray5)",
          6: "var(--hig-gray6)",
        },

        // セマンティック
        "hig-label": "var(--hig-label)",
        "hig-secondary-label": "var(--hig-secondary-label)",
        "hig-background": "var(--hig-system-background)",
        "hig-secondary-background": "var(--hig-secondary-system-background)",
        "hig-separator": "var(--hig-separator)",
      },
    },
  },
};
```

### カラー使用ルール

| 用途                 | トークン                   |
| -------------------- | -------------------------- |
| プライマリアクション | `hig-blue`                 |
| 成功状態             | `hig-green`                |
| 破壊的アクション     | `hig-red`                  |
| 警告                 | `hig-orange`               |
| 通常テキスト         | `hig-label`                |
| 補助テキスト         | `hig-secondary-label`      |
| メイン背景           | `hig-background`           |
| グループ化された背景 | `hig-secondary-background` |
| 区切り線             | `hig-separator`            |

---

## タイポグラフィ

### SF Pro フォントスケール

```css
/* HIG Type Scale */

/* Large Title */
.text-large-title {
  @apply text-[34px] leading-[41px] font-normal tracking-[0.37px];
}

/* Title 1 */
.text-title1 {
  @apply text-[28px] leading-[34px] font-normal tracking-[0.36px];
}

/* Title 2 */
.text-title2 {
  @apply text-[22px] leading-[28px] font-normal tracking-[0.35px];
}

/* Title 3 */
.text-title3 {
  @apply text-[20px] leading-[25px] font-normal tracking-[0.38px];
}

/* Headline */
.text-headline {
  @apply text-[17px] leading-[22px] font-semibold tracking-[-0.41px];
}

/* Body */
.text-body {
  @apply text-[17px] leading-[22px] font-normal tracking-[-0.41px];
}

/* Callout */
.text-callout {
  @apply text-[16px] leading-[21px] font-normal tracking-[-0.32px];
}

/* Subheadline */
.text-subheadline {
  @apply text-[15px] leading-[20px] font-normal tracking-[-0.24px];
}

/* Footnote */
.text-footnote {
  @apply text-[13px] leading-[18px] font-normal tracking-[-0.08px];
}

/* Caption 1 */
.text-caption1 {
  @apply text-[12px] leading-[16px] font-normal tracking-[0];
}

/* Caption 2 */
.text-caption2 {
  @apply text-[11px] leading-[13px] font-normal tracking-[0.07px];
}
```

### Tailwind での近似実装

| HIG スタイル | Tailwind クラス           |
| ------------ | ------------------------- |
| Large Title  | `text-4xl font-normal`    |
| Title 1      | `text-3xl font-normal`    |
| Title 2      | `text-2xl font-normal`    |
| Title 3      | `text-xl font-normal`     |
| Headline     | `text-base font-semibold` |
| Body         | `text-base font-normal`   |
| Callout      | `text-base font-normal`   |
| Subheadline  | `text-sm font-normal`     |
| Footnote     | `text-sm font-normal`     |
| Caption 1    | `text-xs font-normal`     |
| Caption 2    | `text-xs font-normal`     |

### フォント設定

```css
/* SF Pro の代替としてシステムフォントスタック */
:root {
  --hig-font-family:
    -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display",
    "Helvetica Neue", Arial, sans-serif;
  --hig-font-mono:
    "SF Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

body {
  font-family: var(--hig-font-family);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

## シェイプ（角丸）

### Corner Radius Scale

| カテゴリ    | 値   | Tailwind       | 用途                     |
| ----------- | ---- | -------------- | ------------------------ |
| Small       | 4px  | `rounded`      | チップ、小さい要素       |
| Medium      | 8px  | `rounded-lg`   | 入力フィールド、小カード |
| Large       | 10px | `rounded-xl`   | カード、シート           |
| Extra Large | 12px | `rounded-xl`   | 大きなカード             |
| Continuous  | 14px | `rounded-2xl`  | モーダル、ポップオーバー |
| Full        | 50%  | `rounded-full` | 円形ボタン、アバター     |

### iOS スタイルの連続角丸

```css
/* Apple のスーパー楕円角丸を模倣 */
.rounded-continuous {
  border-radius: 14px;
  /* Safari のみ */
  -webkit-mask-image: -webkit-radial-gradient(white, black);
}
```

---

## ブラーとバイブランシー

### Vibrancy 効果

```css
/* 半透明背景 + ブラー */
.vibrancy-light {
  @apply bg-white/70 backdrop-blur-xl;
}

.vibrancy-dark {
  @apply bg-black/50 backdrop-blur-xl;
}

/* Material（厚い半透明） */
.material-thin {
  @apply bg-white/30 backdrop-blur-md;
}

.material-regular {
  @apply bg-white/60 backdrop-blur-lg;
}

.material-thick {
  @apply bg-white/80 backdrop-blur-xl;
}
```

### ナビゲーションバーのブラー

```html
<nav
  class="
  fixed top-0 inset-x-0
  bg-white/80 dark:bg-black/80
  backdrop-blur-lg backdrop-saturate-150
  border-b border-hig-separator
"
>
  <!-- Navigation content -->
</nav>
```

---

## スペーシング

### Layout Margins

| デバイス     | マージン | Tailwind |
| ------------ | -------- | -------- |
| iPhone（縦） | 16px     | `px-4`   |
| iPhone（横） | 20px     | `px-5`   |
| iPad         | 20px     | `px-5`   |
| iPad（大）   | 24px     | `px-6`   |

### 標準間隔

| 値   | Tailwind | 用途                 |
| ---- | -------- | -------------------- |
| 4px  | `gap-1`  | 密接な要素間         |
| 8px  | `gap-2`  | アイコンとテキスト間 |
| 12px | `gap-3`  | リスト項目間         |
| 16px | `gap-4`  | セクション内要素間   |
| 20px | `gap-5`  | セクション間         |
| 32px | `gap-8`  | 大きなセクション間   |

---

## コンポーネント実装例

### Filled Button（iOS スタイル）

```html
<button
  class="
  bg-hig-blue text-white
  px-5 py-3
  rounded-xl
  text-base font-semibold
  active:opacity-70
  transition-opacity
  disabled:opacity-40
  min-h-[50px]
"
>
  Button
</button>
```

### Text Button

```html
<button
  class="
  text-hig-blue
  px-4 py-3
  text-base font-normal
  active:opacity-50
  transition-opacity
"
>
  Button
</button>
```

### Destructive Button

```html
<button
  class="
  bg-hig-red text-white
  px-5 py-3
  rounded-xl
  text-base font-semibold
  active:opacity-70
  transition-opacity
"
>
  Delete
</button>
```

### List Row（UITableViewCell 風）

```html
<div class="bg-white dark:bg-hig-secondary-background">
  <a
    href="#"
    class="
    flex items-center justify-between
    px-4 py-3
    border-b border-hig-separator
    active:bg-hig-gray5 dark:active:bg-hig-gray
    transition-colors
  "
  >
    <div class="flex items-center gap-3">
      <div
        class="w-7 h-7 bg-hig-blue rounded-md flex items-center justify-center"
      >
        <span class="text-white text-sm">A</span>
      </div>
      <span class="text-base text-hig-label">List Item</span>
    </div>
    <svg class="w-4 h-4 text-hig-gray3" fill="currentColor" viewBox="0 0 20 20">
      <path
        fill-rule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
      />
    </svg>
  </a>
</div>
```

### Grouped List Section

```html
<div class="bg-hig-grouped-background">
  <section class="px-4 py-6">
    <h2 class="text-footnote text-hig-secondary-label uppercase px-4 mb-2">
      Section Header
    </h2>
    <div
      class="bg-white dark:bg-hig-secondary-grouped-background rounded-xl overflow-hidden"
    >
      <!-- List items -->
      <div class="px-4 py-3 border-b border-hig-separator">
        <span class="text-body text-hig-label">Item 1</span>
      </div>
      <div class="px-4 py-3 border-b border-hig-separator">
        <span class="text-body text-hig-label">Item 2</span>
      </div>
      <div class="px-4 py-3">
        <span class="text-body text-hig-label">Item 3</span>
      </div>
    </div>
    <p class="text-footnote text-hig-secondary-label px-4 mt-2">
      Section footer with additional information.
    </p>
  </section>
</div>
```

### Card

```html
<div
  class="
  bg-white dark:bg-hig-secondary-background
  rounded-xl
  p-4
  shadow-sm
"
>
  <h3 class="text-headline text-hig-label">Card Title</h3>
  <p class="text-body text-hig-secondary-label mt-1">
    Card content goes here with supporting text.
  </p>
</div>
```

### Navigation Bar（大タイトル）

```html
<!-- 大タイトル表示時 -->
<header class="bg-hig-background">
  <div class="px-4 pt-2 pb-3">
    <h1 class="text-large-title font-bold text-hig-label">Large Title</h1>
  </div>
</header>

<!-- スクロール後（小タイトル表示時）- JS で切り替え -->
<header class="bg-hig-background">
  <div
    class="
    h-11
    flex items-center justify-center
    border-b border-hig-separator
  "
  >
    <h1 class="text-headline text-hig-label">Title</h1>
  </div>
</header>
```

### Search Bar

```html
<div class="px-4 py-2 bg-hig-background">
  <div
    class="
    flex items-center gap-2
    bg-hig-gray6 dark:bg-hig-gray
    rounded-xl
    px-3 py-2
  "
  >
    <svg
      class="w-4 h-4 text-hig-gray"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
    <input
      type="search"
      placeholder="Search"
      class="
        flex-1 bg-transparent
        text-body text-hig-label
        placeholder:text-hig-placeholder
        focus:outline-none
      "
    />
  </div>
</div>
```

### Tab Bar

```html
<nav
  class="
  fixed bottom-0 inset-x-0
  bg-hig-background/80 backdrop-blur-lg
  border-t border-hig-separator
  pb-safe
"
>
  <div class="flex justify-around items-center h-[49px]">
    <a href="#" class="flex flex-col items-center gap-0.5 text-hig-blue">
      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <!-- Icon -->
      </svg>
      <span class="text-caption2">Home</span>
    </a>
    <a href="#" class="flex flex-col items-center gap-0.5 text-hig-gray">
      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <!-- Icon -->
      </svg>
      <span class="text-caption2">Search</span>
    </a>
    <a href="#" class="flex flex-col items-center gap-0.5 text-hig-gray">
      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <!-- Icon -->
      </svg>
      <span class="text-caption2">Settings</span>
    </a>
  </div>
</nav>
```

### Segmented Control

```html
<div class="bg-hig-gray5 dark:bg-hig-gray p-0.5 rounded-lg">
  <div class="relative flex">
    <!-- 選択インジケーター -->
    <div
      class="
      absolute inset-y-0.5 left-0.5
      w-[calc(50%-2px)]
      bg-white dark:bg-hig-secondary-background
      rounded-md
      shadow-sm
      transition-transform
    "
    ></div>

    <!-- セグメント -->
    <button
      class="
      relative flex-1 py-1.5
      text-subheadline font-medium text-hig-label
      z-10
    "
    >
      First
    </button>
    <button
      class="
      relative flex-1 py-1.5
      text-subheadline font-medium text-hig-secondary-label
      z-10
    "
    >
      Second
    </button>
  </div>
</div>
```

### Toggle / Switch

```html
<button
  role="switch"
  aria-checked="true"
  class="
  relative w-[51px] h-[31px]
  bg-hig-green
  rounded-full
  transition-colors
  aria-checked:bg-hig-green
  aria-[checked=false]:bg-hig-gray4
"
>
  <span
    class="
    absolute top-[2px] left-[2px]
    w-[27px] h-[27px]
    bg-white
    rounded-full
    shadow-md
    transition-transform
    aria-checked:translate-x-[20px]
  "
  ></span>
</button>
```

### Alert / Action Sheet

```html
<!-- オーバーレイ -->
<div class="fixed inset-0 bg-black/40 flex items-end justify-center">
  <!-- Action Sheet -->
  <div class="w-full max-w-sm px-2 pb-2">
    <!-- アクショングループ -->
    <div
      class="bg-white/90 dark:bg-hig-secondary-background/90 backdrop-blur-xl rounded-2xl overflow-hidden"
    >
      <button
        class="
        w-full px-4 py-4
        text-xl text-hig-blue
        border-b border-hig-separator
        active:bg-hig-gray5
      "
      >
        Action 1
      </button>
      <button
        class="
        w-full px-4 py-4
        text-xl text-hig-red
        active:bg-hig-gray5
      "
      >
        Destructive Action
      </button>
    </div>

    <!-- キャンセルボタン -->
    <button
      class="
      w-full mt-2 px-4 py-4
      bg-white dark:bg-hig-secondary-background
      rounded-2xl
      text-xl font-semibold text-hig-blue
      active:bg-hig-gray5
    "
    >
      Cancel
    </button>
  </div>
</div>
```

### Modal Sheet

```html
<div class="fixed inset-0 bg-black/40 flex items-end">
  <div
    class="
    w-full
    bg-hig-background
    rounded-t-xl
    max-h-[90vh]
    overflow-hidden
  "
  >
    <!-- Handle -->
    <div class="flex justify-center pt-2 pb-4">
      <div class="w-9 h-1 bg-hig-gray3 rounded-full"></div>
    </div>

    <!-- Content -->
    <div class="px-4 pb-8">
      <h2 class="text-title2 font-bold text-hig-label mb-4">Sheet Title</h2>
      <p class="text-body text-hig-secondary-label">Sheet content goes here.</p>
    </div>
  </div>
</div>
```

---

## Safe Area

### Safe Area Padding

```css
/* Safe Area 対応 */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}

.pt-safe {
  padding-top: env(safe-area-inset-top);
}

.px-safe {
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

### Tailwind 設定

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      padding: {
        safe: "env(safe-area-inset-bottom)",
        "safe-top": "env(safe-area-inset-top)",
      },
    },
  },
};
```

---

## アクセシビリティ

### Dynamic Type 対応

```css
/* ユーザーのフォントサイズ設定を尊重 */
html {
  font-size: 100%; /* ブラウザのデフォルトを使用 */
}

/* rem ベースでサイズを指定 */
.text-body {
  font-size: 1.0625rem; /* 17px at 100% */
}
```

### タッチターゲット

- 最小タッチターゲット: **44x44pt**
- Tailwind: `min-w-11 min-h-11`

### コントラスト比

| 要素           | 最小コントラスト比 |
| -------------- | ------------------ |
| テキスト       | 4.5:1              |
| 大きいテキスト | 3:1                |
| UI 要素        | 3:1                |

### Reduce Motion 対応

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## AI アシスタント指示

このスキルが呼び出されたとき：

1. **常に行うこと**
   - HIG のシステムカラーを使用する
   - セマンティックカラー（label, secondary-label など）を適切に使用
   - 44pt 以上のタッチターゲットを確保
   - ライト/ダークモード両対応のデザイン
   - Safe Area を考慮したレイアウト

2. **決して行わないこと**
   - 44pt 未満のタッチターゲット
   - ハードコードされた色（システムカラーを使用）
   - モーションを強制（prefers-reduced-motion を尊重）
   - コントラスト比 3:1 未満の UI 要素

3. **ワークフロー**
   - まず要素の種類を特定（ボタン、リスト、カードなど）
   - HIG の対応コンポーネント仕様を参照
   - Tailwind クラスで実装
   - ダークモード対応を追加
   - アクセシビリティをチェック

---

## 参考リンク

- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [iOS Design Resources](https://developer.apple.com/design/resources/)
- [SF Symbols](https://developer.apple.com/sf-symbols/)
- [Typography Guidelines](https://developer.apple.com/design/human-interface-guidelines/typography)
- [Color Guidelines](https://developer.apple.com/design/human-interface-guidelines/color)
