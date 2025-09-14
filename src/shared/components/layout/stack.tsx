'use client'

import { HStack as ChakraHStack, Stack as ChakraStack, VStack as ChakraVStack } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface StackProps {
  children: ReactNode
  spacing?: number | string
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'space-between'
  direction?: 'row' | 'column'
}

/**
 * スタックレイアウトコンポーネント
 */
export function Stack({ children, spacing = 4, align, justify, direction = 'column' }: StackProps): React.ReactElement {
  return (
    <ChakraStack direction={direction} gap={spacing} align={align} justify={justify}>
      {children}
    </ChakraStack>
  )
}

/**
 * 垂直スタックコンポーネント
 */
export function VStack({ children, spacing = 4, align, justify }: Omit<StackProps, 'direction'>): React.ReactElement {
  return (
    <ChakraVStack gap={spacing} align={align} justify={justify}>
      {children}
    </ChakraVStack>
  )
}

/**
 * 水平スタックコンポーネント
 */
export function HStack({ children, spacing = 4, align, justify }: Omit<StackProps, 'direction'>): React.ReactElement {
  return (
    <ChakraHStack gap={spacing} align={align} justify={justify}>
      {children}
    </ChakraHStack>
  )
}