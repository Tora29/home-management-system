'use client'

import { Flex as ChakraFlex } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface FlexProps {
  children: ReactNode
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
  justify?: 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly'
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline'
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
  gap?: number | string
}

/**
 * フレックスボックスコンポーネント
 */
export function Flex({
  children,
  direction = 'row',
  justify = 'start',
  align = 'stretch',
  wrap = 'nowrap',
  gap
}: FlexProps): React.ReactElement {
  return (
    <ChakraFlex
      direction={direction}
      justify={justify}
      align={align}
      wrap={wrap}
      gap={gap}
    >
      {children}
    </ChakraFlex>
  )
}