---
name: cyberpunk-design-system
description: サイバーパンクHUD風UIデザインシステム。角カット・コーナーブラケット・警告ストライプ・回路ライン装飾・テックインジケータをCSS(SVG不使用)で実装。HUDスタイルのダッシュボード、サイバーパンクUIパネル作成時に使用。
---

# Cyberpunk HUD Design System

在庫管理アプリ向けのサイバーパンク HUD 風 UI デザインシステム。SVG を使用せず、純粋な CSS（Tailwind CSS）で HUD フレーム、角カット、警告ストライプ、回路ライン装飾を実装するためのガイド。

## このスキルを使用するタイミング

- サイバーパンク風の HUD パネルを作成するとき
- 角がカットされたフレームを実装するとき
- 回路ライン風のコーナー装飾を追加するとき
- 警告ストライプパターンを実装するとき
- テクノロジー感のあるダッシュボードをデザインするとき
- 未来的な UI インジケータを作成するとき

---

## コアコンセプト

### HUD デザインの 5 原則

1. **Cut Corners（角カット）**: 45度にカットされた角がサイバーパンクの象徴
2. **Tech Brackets（テックブラケット）**: 角から伸びる装飾ラインと回路パターン
3. **Warning Stripes（警告ストライプ）**: 斜め縞で危険/重要を表現
4. **Data Indicators（データインジケータ）**: 小さな番号、ドット、ステータス表示
5. **Neon Glow（ネオン発光）**: 暗い背景にネオンカラーの発光効果

### HUD フレームの特徴

- **角カット**: clip-path で実現する多様なカットスタイル
- **コーナーブラケット**: 擬似要素による L 字型装飾
- **回路ライン**: border と擬似要素で伸びるライン
- **テックラベル**: "T-65", "UI-6B46" などの識別子
- **ステータスドット**: 小さな発光インジケータ

---

## カラーシステム

### ネオンカラー（HUD用）

```css
:root {
  /* プライマリ - サイバーシアン */
  --cyber-cyan: #00f0ff;
  --cyber-cyan-dim: #00b8c4;
  --cyber-cyan-glow:
    0 0 10px rgba(0, 240, 255, 0.6), 0 0 30px rgba(0, 240, 255, 0.3);

  /* セカンダリ - ネオンマゼンタ/ピンク */
  --cyber-magenta: #ff00ff;
  --cyber-pink: #ff66ff;
  --cyber-magenta-glow:
    0 0 10px rgba(255, 0, 255, 0.6), 0 0 30px rgba(255, 0, 255, 0.3);

  /* アクセント - エレクトリックイエロー */
  --cyber-yellow: #f0ff00;
  --cyber-yellow-dim: #c4d400;
  --cyber-yellow-glow:
    0 0 10px rgba(240, 255, 0, 0.6), 0 0 30px rgba(240, 255, 0, 0.3);

  /* ステータス */
  --cyber-green: #00ff66;
  --cyber-orange: #ff6600;
  --cyber-red: #ff0044;

  /* ダークベース */
  --cyber-dark: #0a0a12;
  --cyber-darker: #050508;
  --cyber-surface: #10101a;
  --cyber-surface-2: #18182a;
  --cyber-border: #2a2a44;
  --cyber-border-dim: #1a1a2e;

  /* テキスト */
  --cyber-text: #e0e0f0;
  --cyber-text-dim: #606080;
  --cyber-text-bright: #ffffff;
}
```

### Tailwind 拡張設定

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        cyber: {
          cyan: "var(--cyber-cyan)",
          "cyan-dim": "var(--cyber-cyan-dim)",
          magenta: "var(--cyber-magenta)",
          pink: "var(--cyber-pink)",
          yellow: "var(--cyber-yellow)",
          "yellow-dim": "var(--cyber-yellow-dim)",
          green: "var(--cyber-green)",
          orange: "var(--cyber-orange)",
          red: "var(--cyber-red)",
          dark: "var(--cyber-dark)",
          darker: "var(--cyber-darker)",
          surface: "var(--cyber-surface)",
          "surface-2": "var(--cyber-surface-2)",
          border: "var(--cyber-border)",
          "border-dim": "var(--cyber-border-dim)",
          text: "var(--cyber-text)",
          "text-dim": "var(--cyber-text-dim)",
          "text-bright": "var(--cyber-text-bright)",
        },
      },
      boxShadow: {
        "neon-cyan": "var(--cyber-cyan-glow)",
        "neon-magenta": "var(--cyber-magenta-glow)",
        "neon-yellow": "var(--cyber-yellow-glow)",
        // インセットグロー（内側発光）
        "neon-cyan-inset": "inset 0 0 20px rgba(0, 240, 255, 0.1)",
        "neon-magenta-inset": "inset 0 0 20px rgba(255, 0, 255, 0.1)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "electric-flow": "electric-flow 3s linear infinite",
        "border-flow": "border-flow 4s linear infinite",
        glitch: "glitch 0.3s ease-in-out infinite",
        scanline: "scanline 8s linear infinite",
        flicker: "flicker 3s infinite",
        blink: "blink 1s step-end infinite",
      },
      keyframes: {
        "electric-flow": {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "200% 0%" },
        },
        "border-flow": {
          "0%": { backgroundPosition: "0% 0%" },
          "50%": { backgroundPosition: "100% 100%" },
          "100%": { backgroundPosition: "0% 0%" },
        },
        glitch: {
          "0%, 100%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        flicker: {
          "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": { opacity: "1" },
          "20%, 24%, 55%": { opacity: "0.5" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
    },
  },
};
```

---

## HUD フレーム（角カット）

### 基本: 角カットパネル（clip-path）

```html
<!-- 左上と右下の角がカットされたパネル -->
<div
  class="
  relative
  bg-cyber-surface
  border border-cyber-cyan/50
  p-6
"
  style="clip-path: polygon(
    16px 0%, 100% 0%,
    100% calc(100% - 16px), calc(100% - 16px) 100%,
    0% 100%, 0% 16px
  );"
>
  <!-- コンテンツ -->
</div>
```

### バリエーション: 角カットスタイル

```css
/* 左上のみカット */
.clip-corner-tl {
  clip-path: polygon(20px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 20px);
}

/* 右上のみカット */
.clip-corner-tr {
  clip-path: polygon(
    0% 0%,
    calc(100% - 20px) 0%,
    100% 20px,
    100% 100%,
    0% 100%
  );
}

/* 左上・右下カット（対角線） */
.clip-corner-diagonal {
  clip-path: polygon(
    20px 0%,
    100% 0%,
    100% calc(100% - 20px),
    calc(100% - 20px) 100%,
    0% 100%,
    0% 20px
  );
}

/* 全角カット（八角形風） */
.clip-corner-all {
  clip-path: polygon(
    16px 0%,
    calc(100% - 16px) 0%,
    100% 16px,
    100% calc(100% - 16px),
    calc(100% - 16px) 100%,
    16px 100%,
    0% calc(100% - 16px),
    0% 16px
  );
}

/* 右上・右下カット */
.clip-corner-right {
  clip-path: polygon(
    0% 0%,
    calc(100% - 16px) 0%,
    100% 16px,
    100% calc(100% - 16px),
    calc(100% - 16px) 100%,
    0% 100%
  );
}
```

### 角カット + ボーダー（擬似要素使用）

純粋な border は clip-path でカットされるため、擬似要素でボーダーを表現：

```html
<div class="hud-panel-cut">
  <div class="hud-panel-content">
    <!-- コンテンツ -->
  </div>
</div>
```

```css
.hud-panel-cut {
  position: relative;
  background: var(--cyber-surface);
  clip-path: polygon(
    20px 0%,
    calc(100% - 20px) 0%,
    100% 20px,
    100% calc(100% - 20px),
    calc(100% - 20px) 100%,
    20px 100%,
    0% calc(100% - 20px),
    0% 20px
  );
}

/* 外側のボーダー風レイヤー */
.hud-panel-cut::before {
  content: "";
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, var(--cyber-cyan), var(--cyber-magenta));
  clip-path: polygon(
    22px 0%,
    calc(100% - 22px) 0%,
    100% 22px,
    100% calc(100% - 22px),
    calc(100% - 22px) 100%,
    22px 100%,
    0% calc(100% - 22px),
    0% 22px
  );
  z-index: -1;
}

.hud-panel-content {
  position: relative;
  padding: 1.5rem;
}
```

---

## コーナーブラケット装飾

### 基本: L字ブラケット

```html
<!-- 四隅にL字ブラケット -->
<div class="relative p-6 bg-cyber-surface border border-cyber-border">
  <!-- 左上ブラケット -->
  <div class="absolute top-0 left-0 w-6 h-6">
    <div class="absolute top-0 left-0 w-full h-[2px] bg-cyber-cyan"></div>
    <div class="absolute top-0 left-0 h-full w-[2px] bg-cyber-cyan"></div>
  </div>

  <!-- 右上ブラケット -->
  <div class="absolute top-0 right-0 w-6 h-6">
    <div class="absolute top-0 right-0 w-full h-[2px] bg-cyber-cyan"></div>
    <div class="absolute top-0 right-0 h-full w-[2px] bg-cyber-cyan"></div>
  </div>

  <!-- 左下ブラケット -->
  <div class="absolute bottom-0 left-0 w-6 h-6">
    <div class="absolute bottom-0 left-0 w-full h-[2px] bg-cyber-cyan"></div>
    <div class="absolute bottom-0 left-0 h-full w-[2px] bg-cyber-cyan"></div>
  </div>

  <!-- 右下ブラケット -->
  <div class="absolute bottom-0 right-0 w-6 h-6">
    <div class="absolute bottom-0 right-0 w-full h-[2px] bg-cyber-cyan"></div>
    <div class="absolute bottom-0 right-0 h-full w-[2px] bg-cyber-cyan"></div>
  </div>

  <!-- コンテンツ -->
</div>
```

### 拡張: 回路ライン付きブラケット

```html
<!-- 回路ラインが伸びるコーナー装飾 -->
<div class="relative p-8 bg-cyber-surface">
  <!-- 左上 - 水平ライン付き -->
  <div class="absolute top-0 left-0">
    <!-- メインブラケット -->
    <div class="w-8 h-8 border-t-2 border-l-2 border-cyber-cyan"></div>
    <!-- 水平に伸びるライン -->
    <div
      class="absolute top-0 left-8 w-12 h-[2px] bg-gradient-to-r from-cyber-cyan to-transparent"
    ></div>
    <!-- ドットインジケータ -->
    <div
      class="absolute top-[-3px] left-20 w-2 h-2 bg-cyber-cyan rounded-full shadow-neon-cyan"
    ></div>
  </div>

  <!-- 右上 - 垂直ライン付き -->
  <div class="absolute top-0 right-0">
    <div class="w-8 h-8 border-t-2 border-r-2 border-cyber-cyan"></div>
    <!-- 垂直に伸びるライン -->
    <div
      class="absolute top-8 right-0 h-12 w-[2px] bg-gradient-to-b from-cyber-cyan to-transparent"
    ></div>
    <!-- ドットインジケータ -->
    <div
      class="absolute top-20 right-[-3px] w-2 h-2 bg-cyber-cyan rounded-full shadow-neon-cyan"
    ></div>
  </div>

  <!-- 右下 - ダブルライン -->
  <div class="absolute bottom-0 right-0">
    <div class="w-8 h-8 border-b-2 border-r-2 border-cyber-magenta"></div>
    <!-- ダブル水平ライン -->
    <div
      class="absolute bottom-0 right-8 w-16 h-[2px] bg-gradient-to-l from-cyber-magenta to-transparent"
    ></div>
    <div
      class="absolute bottom-2 right-8 w-10 h-[1px] bg-gradient-to-l from-cyber-magenta/50 to-transparent"
    ></div>
  </div>

  <!-- コンテンツ -->
</div>
```

### コンポーネント: ノッチ付きコーナー

```html
<!-- 切り欠き（ノッチ）のあるコーナー -->
<div class="relative p-6 bg-cyber-surface border border-cyber-border">
  <!-- 右上ノッチ -->
  <div class="absolute top-0 right-0 flex items-start">
    <!-- 水平ライン -->
    <div class="w-12 h-[2px] bg-cyber-cyan"></div>
    <!-- ノッチ（段差） -->
    <div class="flex flex-col">
      <div class="w-4 h-[2px] bg-cyber-cyan"></div>
      <div class="w-[2px] h-3 bg-cyber-cyan"></div>
      <div class="w-4 h-[2px] bg-cyber-cyan"></div>
      <div class="w-[2px] h-4 bg-cyber-cyan"></div>
    </div>
  </div>

  <!-- コンテンツ -->
</div>
```

---

## 警告ストライプパターン

### 斜め縞（repeating-linear-gradient）

```html
<!-- 警告ストライプヘッダー -->
<div class="relative overflow-hidden">
  <!-- ストライプバー -->
  <div
    class="h-6 w-full"
    style="background: repeating-linear-gradient(
      -45deg,
      var(--cyber-yellow) 0px,
      var(--cyber-yellow) 10px,
      var(--cyber-dark) 10px,
      var(--cyber-dark) 20px
    );"
  ></div>

  <!-- コンテンツエリア -->
  <div class="p-6 bg-cyber-surface">
    <!-- 内容 -->
  </div>

  <!-- 下部ストライプ -->
  <div
    class="h-2 w-full"
    style="background: repeating-linear-gradient(
      45deg,
      var(--cyber-yellow) 0px,
      var(--cyber-yellow) 8px,
      transparent 8px,
      transparent 16px
    );"
  ></div>
</div>
```

### サイドストライプ付きパネル

```html
<!-- 左サイドにストライプ -->
<div class="flex bg-cyber-surface border border-cyber-border">
  <!-- 警告ストライプサイドバー -->
  <div
    class="w-3 flex-shrink-0"
    style="background: repeating-linear-gradient(
      0deg,
      var(--cyber-orange) 0px,
      var(--cyber-orange) 4px,
      var(--cyber-dark) 4px,
      var(--cyber-dark) 8px
    );"
  ></div>

  <!-- コンテンツ -->
  <div class="p-4 flex-1">
    <span class="text-cyber-orange font-mono text-sm uppercase tracking-wider">
      WARNING: LOW STOCK
    </span>
  </div>
</div>
```

### ストライプコーナー装飾

```html
<!-- コーナーにのみストライプ -->
<div class="relative p-6 bg-cyber-surface border border-cyber-border">
  <!-- 左上コーナーストライプ -->
  <div
    class="absolute top-0 left-0 w-16 h-4"
    style="background: repeating-linear-gradient(
      -45deg,
      var(--cyber-cyan) 0px,
      var(--cyber-cyan) 3px,
      transparent 3px,
      transparent 6px
    );"
  ></div>

  <!-- 右下コーナーストライプ -->
  <div
    class="absolute bottom-0 right-0 w-16 h-4"
    style="background: repeating-linear-gradient(
      45deg,
      var(--cyber-magenta) 0px,
      var(--cyber-magenta) 3px,
      transparent 3px,
      transparent 6px
    );"
  ></div>

  <!-- コンテンツ -->
</div>
```

---

## テックインジケータ

### 識別子ラベル

```html
<!-- パネル識別子 -->
<div class="relative p-6 bg-cyber-surface border border-cyber-border">
  <!-- 右上ID表示 -->
  <div class="absolute top-2 right-3 flex items-center gap-2">
    <span class="text-cyber-text-dim text-[10px] font-mono tracking-widest">
      UI-6B46
    </span>
    <div class="flex gap-0.5">
      <div class="w-1 h-1 bg-cyber-cyan rounded-full"></div>
      <div class="w-1 h-1 bg-cyber-cyan rounded-full"></div>
      <div class="w-1 h-1 bg-cyber-cyan/40 rounded-full"></div>
    </div>
  </div>

  <!-- 左下タイムスタンプ -->
  <div class="absolute bottom-2 left-3">
    <span class="text-cyber-text-dim text-[10px] font-mono"> 05:45:23 </span>
  </div>

  <!-- コンテンツ -->
</div>
```

### ステータスドット

```html
<!-- ステータスインジケータバリエーション -->
<div class="flex items-center gap-4">
  <!-- オンライン（発光アニメーション付き） -->
  <div class="flex items-center gap-2">
    <div class="relative">
      <div class="w-2 h-2 bg-cyber-green rounded-full"></div>
      <div
        class="absolute inset-0 w-2 h-2 bg-cyber-green rounded-full animate-ping opacity-50"
      ></div>
    </div>
    <span class="text-cyber-green text-xs font-mono">ONLINE</span>
  </div>

  <!-- 処理中（点滅） -->
  <div class="flex items-center gap-2">
    <div class="w-2 h-2 bg-cyber-yellow rounded-full animate-blink"></div>
    <span class="text-cyber-yellow text-xs font-mono">PROCESSING</span>
  </div>

  <!-- オフライン -->
  <div class="flex items-center gap-2">
    <div class="w-2 h-2 bg-cyber-text-dim rounded-full"></div>
    <span class="text-cyber-text-dim text-xs font-mono">OFFLINE</span>
  </div>
</div>
```

### データバー（ローディング/プログレス）

```html
<!-- HUDスタイルのプログレスバー -->
<div class="space-y-1">
  <div class="flex justify-between text-[10px] font-mono">
    <span class="text-cyber-text-dim">LOADING</span>
    <span class="text-cyber-cyan">48%</span>
  </div>
  <div class="h-1 bg-cyber-border rounded-sm overflow-hidden">
    <div
      class="h-full w-[48%] bg-gradient-to-r from-cyber-cyan to-cyber-magenta"
    ></div>
  </div>
  <!-- セグメントマーク -->
  <div class="flex justify-between px-0.5">
    <div class="w-[1px] h-1 bg-cyber-border"></div>
    <div class="w-[1px] h-1 bg-cyber-border"></div>
    <div class="w-[1px] h-1 bg-cyber-border"></div>
    <div class="w-[1px] h-1 bg-cyber-border"></div>
    <div class="w-[1px] h-1 bg-cyber-border"></div>
  </div>
</div>
```

### 3ドットインジケータ

```html
<!-- パネル識別用ドット群 -->
<div class="flex items-center gap-1">
  <div
    class="w-2 h-2 rounded-full border border-cyber-cyan bg-cyber-cyan/30"
  ></div>
  <div
    class="w-2 h-2 rounded-full border border-cyber-cyan bg-transparent"
  ></div>
  <div
    class="w-2 h-2 rounded-full border border-cyber-cyan bg-transparent"
  ></div>
</div>

<!-- 横長バージョン -->
<div class="flex items-center gap-0.5">
  <div class="w-4 h-1 bg-cyber-cyan rounded-full"></div>
  <div class="w-2 h-1 bg-cyber-cyan/50 rounded-full"></div>
  <div class="w-2 h-1 bg-cyber-cyan/30 rounded-full"></div>
</div>
```

---

## HUD パネル実装例

### ベーシック HUD カード

```html
<div
  class="
  relative
  bg-cyber-surface
  border border-cyber-cyan/30
  overflow-hidden
"
  style="clip-path: polygon(
    0% 0%, calc(100% - 20px) 0%,
    100% 20px, 100% 100%,
    20px 100%, 0% calc(100% - 20px)
  );"
>
  <!-- 上部ボーダーライン -->
  <div
    class="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyber-cyan to-transparent"
  ></div>

  <!-- コーナーブラケット（左上） -->
  <div class="absolute top-2 left-2">
    <div class="w-4 h-4 border-t border-l border-cyber-cyan"></div>
  </div>

  <!-- 識別子（右上） -->
  <div class="absolute top-3 right-4 flex items-center gap-2">
    <span class="text-cyber-text-dim text-[10px] font-mono">T-65</span>
    <div class="flex gap-0.5">
      <div class="w-1.5 h-1.5 bg-cyber-cyan rounded-sm"></div>
      <div class="w-1.5 h-1.5 bg-cyber-cyan/40 rounded-sm"></div>
      <div class="w-1.5 h-1.5 bg-cyber-cyan/40 rounded-sm"></div>
    </div>
  </div>

  <!-- メインコンテンツ -->
  <div class="p-6 pt-8">
    <h3 class="text-cyber-cyan font-mono text-sm uppercase tracking-wider mb-4">
      INVENTORY STATUS
    </h3>
    <div class="text-4xl font-bold font-mono text-cyber-text-bright">1,247</div>
    <div class="text-cyber-text-dim text-sm mt-1">ITEMS IN STOCK</div>
  </div>

  <!-- 下部装飾 -->
  <div
    class="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyber-cyan via-transparent to-cyber-magenta"
  ></div>
</div>
```

### 警告パネル（ストライプ付き）

```html
<div class="relative bg-cyber-surface border border-cyber-orange/50">
  <!-- 左サイドストライプ -->
  <div
    class="absolute left-0 top-0 bottom-0 w-2"
    style="background: repeating-linear-gradient(
      0deg,
      var(--cyber-orange) 0px,
      var(--cyber-orange) 4px,
      var(--cyber-dark) 4px,
      var(--cyber-dark) 8px
    );"
  ></div>

  <!-- コーナーブラケット -->
  <div
    class="absolute top-1 right-1 w-4 h-4 border-t border-r border-cyber-orange"
  ></div>
  <div
    class="absolute bottom-1 right-1 w-4 h-4 border-b border-r border-cyber-orange"
  ></div>

  <!-- コンテンツ -->
  <div class="pl-5 pr-4 py-4">
    <div class="flex items-center gap-2 mb-2">
      <div class="w-2 h-2 bg-cyber-orange rounded-full animate-pulse"></div>
      <span
        class="text-cyber-orange text-xs font-mono uppercase tracking-wider"
      >
        LOW STOCK WARNING
      </span>
    </div>
    <p class="text-cyber-text text-sm">12 items are below minimum threshold</p>
  </div>
</div>
```

### 全角カット + 回路装飾パネル

```html
<div
  class="relative bg-cyber-surface"
  style="clip-path: polygon(
    16px 0%, calc(100% - 16px) 0%,
    100% 16px, 100% calc(100% - 16px),
    calc(100% - 16px) 100%, 16px 100%,
    0% calc(100% - 16px), 0% 16px
  );"
>
  <!-- 外側ボーダー効果 -->
  <div
    class="absolute inset-0 bg-gradient-to-br from-cyber-cyan/20 via-transparent to-cyber-magenta/20"
    style="clip-path: polygon(
      16px 0%, calc(100% - 16px) 0%,
      100% 16px, 100% calc(100% - 16px),
      calc(100% - 16px) 100%, 16px 100%,
      0% calc(100% - 16px), 0% 16px
    );"
  ></div>

  <!-- 左上から伸びる回路ライン -->
  <div class="absolute top-4 left-4">
    <div class="w-3 h-3 border-t border-l border-cyber-cyan"></div>
    <div
      class="absolute top-0 left-3 w-8 h-[1px] bg-gradient-to-r from-cyber-cyan to-transparent"
    ></div>
    <div
      class="absolute top-0 left-11 w-1 h-1 bg-cyber-cyan rounded-full"
    ></div>
  </div>

  <!-- 右下から伸びる回路ライン -->
  <div class="absolute bottom-4 right-4">
    <div class="w-3 h-3 border-b border-r border-cyber-magenta"></div>
    <div
      class="absolute bottom-0 right-3 w-12 h-[1px] bg-gradient-to-l from-cyber-magenta to-transparent"
    ></div>
  </div>

  <!-- コンテンツ -->
  <div class="relative p-8">
    <div
      class="text-cyber-cyan font-mono text-xs uppercase tracking-widest mb-4"
    >
      SYSTEM MONITOR
    </div>
    <div class="grid grid-cols-2 gap-4">
      <div>
        <div class="text-cyber-text-dim text-[10px] uppercase">CPU</div>
        <div class="text-cyber-green font-mono text-2xl">47%</div>
      </div>
      <div>
        <div class="text-cyber-text-dim text-[10px] uppercase">MEM</div>
        <div class="text-cyber-yellow font-mono text-2xl">82%</div>
      </div>
    </div>
  </div>
</div>
```

---

## グリッド背景パターン

### 回路基板グリッド

```html
<div
  class="
  min-h-screen
  bg-cyber-dark
  bg-[linear-gradient(var(--cyber-border-dim)_1px,transparent_1px),linear-gradient(90deg,var(--cyber-border-dim)_1px,transparent_1px)]
  bg-[size:40px_40px]
"
>
  <!-- コンテンツ -->
</div>
```

### ドットグリッド

```html
<div
  class="
  bg-cyber-dark
  bg-[radial-gradient(var(--cyber-border)_1px,transparent_1px)]
  bg-[size:20px_20px]
"
>
  <!-- コンテンツ -->
</div>
```

### スキャンライン効果

```html
<div class="relative overflow-hidden">
  <!-- 静的スキャンライン -->
  <div
    class="
    pointer-events-none
    absolute inset-0
    bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.15)_2px,rgba(0,0,0,0.15)_4px)]
  "
  ></div>

  <!-- コンテンツ -->
</div>
```

---

## タイポグラフィ

### フォント設定

```css
:root {
  /* HUD/テクノフォント */
  --cyber-font-display: "Orbitron", "Rajdhani", system-ui, sans-serif;
  --cyber-font-body: "Rajdhani", "Exo 2", system-ui, sans-serif;
  --cyber-font-mono: "Share Tech Mono", "JetBrains Mono", monospace;
}
```

### HUD テキストスタイル

```css
/* ディスプレイ（大見出し） */
.text-hud-display {
  font-family: var(--cyber-font-display);
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* セクションタイトル */
.text-hud-title {
  font-family: var(--cyber-font-mono);
  font-size: 0.75rem;
  font-weight: 400;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--cyber-cyan);
}

/* データ表示 */
.text-hud-data {
  font-family: var(--cyber-font-mono);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

/* ラベル（小さい識別子） */
.text-hud-label {
  font-family: var(--cyber-font-mono);
  font-size: 0.625rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--cyber-text-dim);
}
```

---

## ボタン

### HUD ボタン（角カット）

```html
<!-- プライマリボタン -->
<button
  class="
  relative
  bg-cyber-cyan/10
  border border-cyber-cyan
  text-cyber-cyan
  px-6 py-2.5
  font-mono text-sm uppercase tracking-wider
  transition-all duration-200
  hover:bg-cyber-cyan hover:text-cyber-dark
  hover:shadow-neon-cyan
"
  style="clip-path: polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px);"
>
  ACTIVATE
</button>

<!-- 危険ボタン -->
<button
  class="
  relative
  bg-cyber-red/10
  border border-cyber-red
  text-cyber-red
  px-6 py-2.5
  font-mono text-sm uppercase tracking-wider
  transition-all duration-200
  hover:bg-cyber-red hover:text-white
  hover:shadow-[0_0_20px_rgba(255,0,68,0.5)]
"
>
  DELETE
</button>
```

### インジケータ付きボタン

```html
<button
  class="
  flex items-center gap-3
  bg-cyber-surface
  border border-cyber-border
  text-cyber-text
  px-4 py-2.5
  transition-all
  hover:border-cyber-cyan hover:text-cyber-cyan
"
>
  <!-- ステータスドット -->
  <div class="w-2 h-2 bg-cyber-green rounded-full"></div>
  <span class="font-mono text-sm uppercase tracking-wider">SYNC DATA</span>
  <!-- 矢印インジケータ -->
  <div class="flex gap-0.5 ml-2">
    <div class="w-1 h-2 bg-current opacity-40"></div>
    <div class="w-1 h-2 bg-current opacity-60"></div>
    <div class="w-1 h-2 bg-current"></div>
  </div>
</button>
```

---

## 入力フィールド

### HUD 入力

```html
<div class="space-y-2">
  <label
    class="text-cyber-text-dim text-[10px] font-mono uppercase tracking-widest"
  >
    ITEM CODE
  </label>
  <div class="relative">
    <input
      type="text"
      placeholder="ENTER CODE..."
      class="
        w-full
        bg-cyber-surface-2
        border border-cyber-border
        text-cyber-text font-mono
        placeholder:text-cyber-text-dim
        px-4 py-3
        focus:outline-none
        focus:border-cyber-cyan
        focus:shadow-[inset_0_0_10px_rgba(0,240,255,0.1)]
        transition-all
      "
      style="clip-path: polygon(8px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 8px);"
    />
    <!-- 左上コーナーマーク -->
    <div
      class="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyber-cyan pointer-events-none"
    ></div>
  </div>
</div>
```

---

## データテーブル

### HUD テーブル

```html
<div
  class="relative bg-cyber-surface border border-cyber-border overflow-hidden"
>
  <!-- ヘッダー装飾 -->
  <div
    class="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyber-cyan via-cyber-magenta to-cyber-cyan"
  ></div>

  <!-- コーナーブラケット -->
  <div
    class="absolute top-2 left-2 w-3 h-3 border-t border-l border-cyber-cyan"
  ></div>
  <div
    class="absolute top-2 right-2 w-3 h-3 border-t border-r border-cyber-cyan"
  ></div>

  <!-- テーブルヘッダー -->
  <div
    class="px-4 py-3 border-b border-cyber-border flex items-center justify-between bg-cyber-surface-2"
  >
    <span class="text-cyber-cyan text-xs font-mono uppercase tracking-wider">
      INVENTORY DATABASE
    </span>
    <div class="flex items-center gap-2">
      <span class="text-cyber-text-dim text-[10px] font-mono">REC: 1,247</span>
      <div class="w-1.5 h-1.5 bg-cyber-green rounded-full animate-pulse"></div>
    </div>
  </div>

  <!-- テーブル本体 -->
  <table class="w-full">
    <thead>
      <tr class="border-b border-cyber-border">
        <th
          class="px-4 py-2 text-cyber-text-dim text-[10px] font-mono uppercase tracking-wider text-left"
        >
          ID
        </th>
        <th
          class="px-4 py-2 text-cyber-text-dim text-[10px] font-mono uppercase tracking-wider text-left"
        >
          ITEM
        </th>
        <th
          class="px-4 py-2 text-cyber-text-dim text-[10px] font-mono uppercase tracking-wider text-right"
        >
          QTY
        </th>
        <th
          class="px-4 py-2 text-cyber-text-dim text-[10px] font-mono uppercase tracking-wider text-right"
        >
          STATUS
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        class="border-b border-cyber-border-dim hover:bg-cyber-cyan/5 transition-colors"
      >
        <td class="px-4 py-3 text-cyber-cyan font-mono text-sm">#001247</td>
        <td class="px-4 py-3 text-cyber-text text-sm">Quantum Processor</td>
        <td class="px-4 py-3 text-cyber-text font-mono text-sm text-right">
          142
        </td>
        <td class="px-4 py-3 text-right">
          <span
            class="inline-flex items-center gap-1.5 text-cyber-green text-[10px] font-mono"
          >
            <span class="w-1.5 h-1.5 bg-cyber-green rounded-full"></span>
            IN STOCK
          </span>
        </td>
      </tr>
      <tr
        class="border-b border-cyber-border-dim hover:bg-cyber-cyan/5 transition-colors"
      >
        <td class="px-4 py-3 text-cyber-cyan font-mono text-sm">#001248</td>
        <td class="px-4 py-3 text-cyber-text text-sm">Neural Interface</td>
        <td class="px-4 py-3 text-cyber-text font-mono text-sm text-right">
          12
        </td>
        <td class="px-4 py-3 text-right">
          <span
            class="inline-flex items-center gap-1.5 text-cyber-orange text-[10px] font-mono animate-pulse"
          >
            <span class="w-1.5 h-1.5 bg-cyber-orange rounded-full"></span>
            LOW
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## ナビゲーション

### HUD ナビゲーションバー

```html
<nav
  class="relative bg-cyber-dark/95 backdrop-blur-sm border-b border-cyber-border"
>
  <!-- 上部ライン -->
  <div
    class="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyber-cyan to-transparent"
  ></div>

  <div class="max-w-7xl mx-auto px-6">
    <div class="flex items-center justify-between h-14">
      <!-- ロゴ -->
      <div class="flex items-center gap-3">
        <div
          class="w-8 h-8 bg-cyber-surface border border-cyber-cyan flex items-center justify-center"
          style="clip-path: polygon(6px 0%, 100% 0%, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0% 100%, 0% 6px);"
        >
          <span class="text-cyber-cyan font-bold text-xs">INV</span>
        </div>
        <span class="text-cyber-text font-mono text-sm tracking-wider">
          INVENTORY.SYS
        </span>
      </div>

      <!-- ナビリンク -->
      <div class="flex items-center gap-1">
        <a
          href="#"
          class="
          px-4 py-2
          text-cyber-cyan text-xs font-mono uppercase tracking-wider
          bg-cyber-cyan/10 border-b-2 border-cyber-cyan
        "
        >
          Dashboard
        </a>
        <a
          href="#"
          class="
          px-4 py-2
          text-cyber-text-dim text-xs font-mono uppercase tracking-wider
          hover:text-cyber-cyan hover:bg-cyber-cyan/5
          transition-colors
        "
        >
          Items
        </a>
        <a
          href="#"
          class="
          px-4 py-2
          text-cyber-text-dim text-xs font-mono uppercase tracking-wider
          hover:text-cyber-cyan hover:bg-cyber-cyan/5
          transition-colors
        "
        >
          Reports
        </a>
      </div>

      <!-- ステータス -->
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 bg-cyber-green rounded-full animate-pulse"></div>
        <span
          class="text-cyber-green text-[10px] font-mono uppercase tracking-wider"
        >
          ONLINE
        </span>
      </div>
    </div>
  </div>

  <!-- 下部ライン -->
  <div class="absolute bottom-0 left-0 right-0 h-[1px] bg-cyber-border"></div>
</nav>
```

---

## モーダル/ダイアログ

### HUD ダイアログ

```html
<!-- オーバーレイ -->
<div
  class="fixed inset-0 bg-cyber-darker/90 backdrop-blur-sm flex items-center justify-center z-50"
>
  <!-- ダイアログ -->
  <div
    class="relative bg-cyber-surface w-full max-w-md overflow-hidden"
    style="clip-path: polygon(
      20px 0%, calc(100% - 20px) 0%,
      100% 20px, 100% calc(100% - 20px),
      calc(100% - 20px) 100%, 20px 100%,
      0% calc(100% - 20px), 0% 20px
    );"
  >
    <!-- 電流ボーダー -->
    <div
      class="absolute inset-0 pointer-events-none"
      style="
        background: linear-gradient(135deg, var(--cyber-cyan), var(--cyber-magenta));
        clip-path: polygon(
          20px 0%, calc(100% - 20px) 0%,
          100% 20px, 100% calc(100% - 20px),
          calc(100% - 20px) 100%, 20px 100%,
          0% calc(100% - 20px), 0% 20px
        );
        padding: 2px;
      "
    >
      <div
        class="w-full h-full bg-cyber-surface"
        style="clip-path: polygon(
          18px 0%, calc(100% - 18px) 0%,
          100% 18px, 100% calc(100% - 18px),
          calc(100% - 18px) 100%, 18px 100%,
          0% calc(100% - 18px), 0% 18px
        );"
      ></div>
    </div>

    <!-- コーナー装飾 -->
    <div
      class="absolute top-4 left-4 w-4 h-4 border-t border-l border-cyber-cyan"
    ></div>
    <div
      class="absolute top-4 right-4 w-4 h-4 border-t border-r border-cyber-cyan"
    ></div>
    <div
      class="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-cyber-magenta"
    ></div>
    <div
      class="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-cyber-magenta"
    ></div>

    <!-- ヘッダー -->
    <div class="relative px-6 py-4 border-b border-cyber-border">
      <h3 class="text-cyber-cyan font-mono text-sm uppercase tracking-wider">
        CONFIRM ACTION
      </h3>
    </div>

    <!-- コンテンツ -->
    <div class="relative px-6 py-6">
      <p class="text-cyber-text text-sm">
        Are you sure you want to remove this item from inventory?
      </p>
    </div>

    <!-- フッター -->
    <div
      class="relative px-6 py-4 border-t border-cyber-border flex justify-end gap-3"
    >
      <button
        class="px-4 py-2 text-cyber-text-dim text-sm font-mono uppercase tracking-wider hover:text-cyber-text transition-colors"
      >
        CANCEL
      </button>
      <button
        class="px-4 py-2 bg-cyber-red text-white text-sm font-mono uppercase tracking-wider hover:shadow-[0_0_15px_rgba(255,0,68,0.5)] transition-all"
        style="clip-path: polygon(6px 0%, 100% 0%, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0% 100%, 0% 6px);"
      >
        CONFIRM
      </button>
    </div>
  </div>
</div>
```

---

## AI アシスタント指示

このスキルが呼び出されたとき：

### 1. 常に行うこと

- ダークベース（`cyber-dark` または `cyber-surface`）を背景に使用
- **clip-path で角カットを実装**（SVG は使用しない）
- コーナーブラケット（L字装飾）を追加
- 回路ライン風の装飾を `border` と擬似要素で表現
- 警告/重要な要素には斜めストライプ（`repeating-linear-gradient`）
- テックインジケータ（ID、タイムスタンプ、ドット）を配置
- フォントは `font-mono` を数値・コード・ラベルに使用
- ステータス表示には色で区別（緑=OK、オレンジ=警告、赤=エラー）

### 2. 決して行わないこと

- SVG の使用（パフォーマンス上の理由で禁止）
- 明るい背景色の使用
- ネオンカラーの過剰使用
- アニメーションの過剰使用
- 読みにくいフォントサイズ（最小 10px）

### 3. HUD 要素の優先順位

1. **角カット** - 最も重要。`clip-path` で実装
2. **コーナーブラケット** - L字の border 装飾
3. **回路ライン** - コーナーから伸びるライン
4. **テックインジケータ** - ID、ドット、ステータス
5. **警告ストライプ** - 重要/警告要素のみ

### 4. clip-path の値早見表

```css
/* 左上カット */
clip-path: polygon(16px 0%, 100% 0%, 100% 100%, 0% 100%, 0% 16px);

/* 対角線カット（左上・右下） */
clip-path: polygon(
  16px 0%,
  100% 0%,
  100% calc(100% - 16px),
  calc(100% - 16px) 100%,
  0% 100%,
  0% 16px
);

/* 全角カット */
clip-path: polygon(
  16px 0%,
  calc(100% - 16px) 0%,
  100% 16px,
  100% calc(100% - 16px),
  calc(100% - 16px) 100%,
  16px 100%,
  0% calc(100% - 16px),
  0% 16px
);

/* 右側カット */
clip-path: polygon(
  0% 0%,
  calc(100% - 16px) 0%,
  100% 16px,
  100% calc(100% - 16px),
  calc(100% - 16px) 100%,
  0% 100%
);
```

### 5. 色の使い分け

| カラー           | 用途                                   |
| ---------------- | -------------------------------------- |
| `cyber-cyan`     | プライマリ、ナビ、アクティブ状態       |
| `cyber-magenta`  | セカンダリアクセント、グラデーション   |
| `cyber-yellow`   | 警告ストライプ、強調                   |
| `cyber-green`    | 成功、在庫あり、オンライン             |
| `cyber-orange`   | 警告、低在庫                           |
| `cyber-red`      | エラー、在庫切れ、危険アクション       |
| `cyber-text-dim` | ラベル、補助テキスト、非アクティブ状態 |

---

## 参考リンク

- [Tailwind CSS clip-path](https://tailwindcss.com/docs/clip-path) ※カスタムで使用
- [CSS clip-path maker](https://bennettfeely.com/clippy/)
- [repeating-linear-gradient](https://developer.mozilla.org/en-US/docs/Web/CSS/repeating-linear-gradient)
- [Google Fonts - Orbitron](https://fonts.google.com/specimen/Orbitron)
- [Google Fonts - Share Tech Mono](https://fonts.google.com/specimen/Share+Tech+Mono)
