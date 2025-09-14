'use client'

import { Wrap as ChakraWrap, WrapItem } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface WrapProps {
  children: ReactNode
  spacing?: number | string
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'space-between'
}

/**
 * ラップレイアウトコンポーネント
 */
export function Wrap({ children, spacing = 2, align, justify }: WrapProps): React.ReactElement {
  return (
    <ChakraWrap gap={spacing} align={align} justify={justify}>
      {children}
    </ChakraWrap>
  )
}

export { WrapItem }