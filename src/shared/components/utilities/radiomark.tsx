'use client'

import { Radiomark as ChakraRadiomark } from '@chakra-ui/react'

interface RadiomarkProps {
  checked?: boolean
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

/**
 * ラジオマークコンポーネント
 */
export function Radiomark({ checked = false, size = 'md', color = 'blue.500' }: RadiomarkProps): React.ReactElement | null {
  if (!checked) return null

  return <ChakraRadiomark boxSize={size === 'sm' ? 2 : size === 'md' ? 3 : 4} color={color} />
}