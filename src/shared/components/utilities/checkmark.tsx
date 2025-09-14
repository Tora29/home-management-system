'use client'

import { Checkmark as ChakraCheckmark } from '@chakra-ui/react'

interface CheckmarkProps {
  checked?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

/**
 * チェックマークコンポーネント
 */
export function Checkmark({ checked = false, size = 'md', color = 'green.500' }: CheckmarkProps): React.ReactElement | null {
  if (!checked) return null

  return <ChakraCheckmark boxSize={size === 'sm' ? 3 : size === 'md' ? 4 : 5} color={color} />
}