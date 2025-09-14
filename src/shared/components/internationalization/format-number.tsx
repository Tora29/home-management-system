'use client'

interface FormatNumberProps {
  value: number
  style?: 'decimal' | 'currency' | 'percent' | 'unit'
  currency?: string
  minimumFractionDigits?: number
  maximumFractionDigits?: number
  locale?: string
}

/**
 * 数値フォーマットコンポーネント
 */
export function FormatNumber({
  value,
  style = 'decimal',
  currency = 'JPY',
  minimumFractionDigits,
  maximumFractionDigits,
  locale = 'ja-JP'
}: FormatNumberProps): React.ReactElement {
  const formatter = new Intl.NumberFormat(locale, {
    style,
    currency: style === 'currency' ? currency : undefined,
    minimumFractionDigits,
    maximumFractionDigits
  })

  return <span>{formatter.format(value)}</span>
}