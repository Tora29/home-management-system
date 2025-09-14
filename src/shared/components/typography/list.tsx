'use client'

import { List } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface ListProps {
  children: ReactNode
  variant?: 'ordered' | 'unordered' | 'unstyled'
  spacing?: number
}

/**
 * リストコンポーネント
 */
export function ListComponent({ children, variant = 'unordered', spacing = 2 }: ListProps): React.ReactElement {
  const as = variant === 'ordered' ? 'ol' : 'ul'

  return (
    <List.Root as={as} gap={spacing} variant={variant === 'unstyled' ? 'plain' : undefined}>
      {children}
    </List.Root>
  )
}

export const ListItem = List.Item
export const ListIndicator = List.Indicator