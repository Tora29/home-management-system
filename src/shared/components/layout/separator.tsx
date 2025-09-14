'use client'

import { Separator as ChakraSeparator } from '@chakra-ui/react'

interface SeparatorProps {
  orientation?: 'horizontal' | 'vertical'
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

/**
 * セパレーターコンポーネント
 */
export function Separator({ orientation = 'horizontal', size = 'md' }: SeparatorProps): React.ReactElement {
  return <ChakraSeparator orientation={orientation} size={size} />
}