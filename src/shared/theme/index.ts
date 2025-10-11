import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

/**
 * カスタムテーマ設定
 * Silver Color Palettes
 */
const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        // Primary Colors
        primary: {
          50: { value: '#e6f0ff' },
          100: { value: '#b3d1ff' },
          200: { value: '#80b3ff' },
          300: { value: '#4d94ff' },
          400: { value: '#1a75ff' },
          500: { value: '#003672' }, // Main
          600: { value: '#002b5a' },
          700: { value: '#002043' },
          800: { value: '#00152c' },
          900: { value: '#000a15' },
        },
        secondary: {
          50: { value: '#f0f2f5' },
          100: { value: '#d4dae3' },
          200: { value: '#b8c2d1' },
          300: { value: '#9caabf' },
          400: { value: '#7c92ad' },
          500: { value: '#5c6f8b' }, // Main
          600: { value: '#4a5b73' },
          700: { value: '#38475b' },
          800: { value: '#263343' },
          900: { value: '#14202b' },
        },

        // Semantic Colors
        success: {
          50: { value: '#f0fdf4' },
          100: { value: '#dcfce7' },
          200: { value: '#bbf7d0' },
          300: { value: '#86efac' },
          400: { value: '#4ade80' },
          500: { value: '#38A169' }, // Main
          600: { value: '#2f855a' },
          700: { value: '#276749' },
          800: { value: '#22543d' },
          900: { value: '#1c4532' },
        },
        warning: {
          50: { value: '#fffbeb' },
          100: { value: '#fef3c7' },
          200: { value: '#fde68a' },
          300: { value: '#fcd34d' },
          400: { value: '#fbbf24' },
          500: { value: '#DD6B20' }, // Main
          600: { value: '#c05621' },
          700: { value: '#9c4221' },
          800: { value: '#7c2d12' },
          900: { value: '#6c2810' },
        },
        danger: {
          50: { value: '#fff5f5' },
          100: { value: '#fed7d7' },
          200: { value: '#feb2b2' },
          300: { value: '#fc8181' },
          400: { value: '#f56565' },
          500: { value: '#E53E3E' }, // Main
          600: { value: '#c53030' },
          700: { value: '#9b2c2c' },
          800: { value: '#822727' },
          900: { value: '#63171b' },
        },
        info: {
          50: { value: '#ebf8ff' },
          100: { value: '#bee3f8' },
          200: { value: '#90cdf4' },
          300: { value: '#63b3ed' },
          400: { value: '#4299e1' },
          500: { value: '#3182CE' }, // Main
          600: { value: '#2b6cb0' },
          700: { value: '#2c5282' },
          800: { value: '#2a4365' },
          900: { value: '#1a365d' },
        },

        // Background Colors
        bg: {
          light: { value: '#f7fafd' },
          default: { value: '#e2e7e7' },
          card: { value: '#ffffff' },
        },

        // Text Colors
        text: {
          primary: { value: '#003672' },
          secondary: { value: '#5c6f8b' },
          muted: { value: '#9caabf' },
          inverse: { value: '#ffffff' },
        },

        // Border Colors
        border: {
          default: { value: '#e2e7e7' },
          focus: { value: '#003672' },
          error: { value: '#E53E3E' },
        },
      },

      fonts: {
        body: {
          value: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        },
        heading: {
          value: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
        },
        mono: {
          value: 'Menlo, Monaco, "Courier New", monospace',
        },
      },

      fontSizes: {
        xs: { value: '0.75rem' }, // 12px
        sm: { value: '0.875rem' }, // 14px
        md: { value: '1rem' }, // 16px
        lg: { value: '1.125rem' }, // 18px
        xl: { value: '1.25rem' }, // 20px
        '2xl': { value: '1.5rem' }, // 24px
        '3xl': { value: '1.875rem' }, // 30px
        '4xl': { value: '2.25rem' }, // 36px
        '5xl': { value: '3rem' }, // 48px
      },

      fontWeights: {
        normal: { value: 400 },
        medium: { value: 500 },
        semibold: { value: 600 },
        bold: { value: 700 },
      },

      radii: {
        sm: { value: '0.25rem' }, // 4px
        md: { value: '0.375rem' }, // 6px
        lg: { value: '0.5rem' }, // 8px
        xl: { value: '0.75rem' }, // 12px
        full: { value: '9999px' },
      },

      shadows: {
        sm: { value: '0 1px 2px rgba(0, 54, 114, 0.05)' },
        md: { value: '0 2px 4px rgba(0, 54, 114, 0.1)' },
        lg: { value: '0 4px 8px rgba(0, 54, 114, 0.15)' },
        xl: { value: '0 8px 16px rgba(0, 54, 114, 0.2)' },
      },

      spacing: {
        // Chakra UIのデフォルトスペーシング（4px基準）を使用
        // 必要に応じてカスタマイズ
      },
    },

    semanticTokens: {
      colors: {
        // アプリケーション全体で使用するセマンティックトークン
        'app.bg': {
          value: { base: '{colors.bg.light}' },
        },
        'app.card.bg': {
          value: { base: '{colors.bg.card}' },
        },
        'app.text': {
          value: { base: '{colors.text.primary}' },
        },
        'app.text.muted': {
          value: { base: '{colors.text.secondary}' },
        },

        // 金額表示用
        'amount.positive': {
          value: { base: '{colors.success.500}' },
        },
        'amount.negative': {
          value: { base: '{colors.danger.500}' },
        },
        'amount.neutral': {
          value: { base: '{colors.text.secondary}' },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
