'use client'

import { Group as ChakraGroup } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface GroupProps {
  children: ReactNode
  gap?: number | string
  wrap?: 'wrap' | 'nowrap'
  grow?: boolean
  justify?: 'start' | 'center' | 'end' | 'space-between'
}

/**
 * グループレイアウトコンポーネント
 */
export function Group({ children, gap = 2, wrap = 'wrap', grow, justify }: GroupProps): React.ReactElement {
  return (
    <ChakraGroup gap={gap} wrap={wrap} grow={grow} justify={justify}>
      {children}
    </ChakraGroup>
  )
}