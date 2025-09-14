'use client'

import { HStack } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface ButtonGroupProps {
  children: ReactNode
  spacing?: number | string
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around'
}

/**
 * ボタングループコンポーネント
 */
export function ButtonGroup({
  children,
  spacing = 2,
  justify = 'start'
}: ButtonGroupProps): React.ReactElement {
  return (
    <HStack spacing={spacing} justify={justify}>
      {children}
    </HStack>
  )
}