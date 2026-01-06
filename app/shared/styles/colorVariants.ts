/**
 * サイバーパンクデザインシステム用の色バリアント定義
 *
 * 各色の Tailwind ユーティリティクラスを一元管理する。
 * コンポーネント間で一貫した色使いを保証するために使用する。
 */

// 利用可能な色種別
export type ColorVariant = "cyan" | "green" | "magenta" | "orange";

// 各色に対するクラス定義
export type ColorClasses = {
  border: string;
  text: string;
  value: string;
  gradient: string;
  bg: string;
  bgFaded: string;
};

/**
 * 色ごとの Tailwind クラス定義
 *
 * - border: ボーダー色（透明度付き）
 * - text: テキスト色
 * - value: 数値表示用テキスト色
 * - gradient: グラデーション用 via クラス
 * - bg: 背景色（ソリッド）
 * - bgFaded: 背景色（透明度付き）
 */
export const colorVariants: Record<ColorVariant, ColorClasses> = {
  cyan: {
    border: "border-cyber-cyan/30",
    text: "text-cyber-cyan",
    value: "text-cyber-text-bright",
    gradient: "via-cyber-cyan",
    bg: "bg-cyber-cyan",
    bgFaded: "bg-cyber-cyan/40",
  },
  green: {
    border: "border-cyber-green/30",
    text: "text-cyber-green",
    value: "text-cyber-green",
    gradient: "via-cyber-green",
    bg: "bg-cyber-green",
    bgFaded: "bg-cyber-green/40",
  },
  magenta: {
    border: "border-cyber-magenta/30",
    text: "text-cyber-magenta",
    value: "text-cyber-magenta",
    gradient: "via-cyber-magenta",
    bg: "bg-cyber-magenta",
    bgFaded: "bg-cyber-magenta/40",
  },
  orange: {
    border: "border-cyber-orange/30",
    text: "text-cyber-orange",
    value: "text-cyber-orange",
    gradient: "via-cyber-orange",
    bg: "bg-cyber-orange",
    bgFaded: "bg-cyber-orange/40",
  },
};
