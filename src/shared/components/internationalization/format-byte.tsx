'use client'

import { FormatByte as ChakraFormatByte } from '@chakra-ui/react'

interface FormatByteProps {
  value: number
  locale?: string
  unit?: 'byte' | 'bit'
  unitDisplay?: 'short' | 'long' | 'narrow'
}

/**
 * バイトフォーマットコンポーネント
 */
export function FormatByte({
  value,
  locale = 'ja-JP',
  unit = 'byte',
  unitDisplay = 'short'
}: FormatByteProps): React.ReactElement {
  return (
    <ChakraFormatByte
      value={value}
      locale={locale}
      unit={unit}
      unitDisplay={unitDisplay}
    />
  )
}