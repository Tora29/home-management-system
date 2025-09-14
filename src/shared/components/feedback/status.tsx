'use client'

import { Status as ChakraStatus } from '@chakra-ui/react'

interface StatusProps {
  value?: 'info' | 'success' | 'warning' | 'error'
  label?: string
  size?: 'sm' | 'md' | 'lg'
}

/**
 * ステータスインジケーターコンポーネント
 */
export function StatusIndicator({ value = 'info', label, size = 'md' }: StatusProps): React.ReactElement {
  return (
    <ChakraStatus.Root size={size}>
      <ChakraStatus.Indicator colorPalette={value === 'error' ? 'red' : value === 'warning' ? 'yellow' : value === 'success' ? 'green' : 'blue'} />
      {label && <ChakraStatus.Label>{label}</ChakraStatus.Label>}
    </ChakraStatus.Root>
  )
}