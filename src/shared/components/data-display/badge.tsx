'use client'

import { Badge as ChakraBadge } from '@chakra-ui/react'

interface BadgeProps {
  children: React.ReactNode
  colorScheme?: string
  variant?: 'solid' | 'subtle' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

/**
 * バッジコンポーネント
 */
export function Badge({ children, colorScheme = 'gray', variant = 'subtle', size = 'md' }: BadgeProps): React.ReactElement {
  return (
    <ChakraBadge colorScheme={colorScheme} variant={variant} size={size}>
      {children}
    </ChakraBadge>
  )
}