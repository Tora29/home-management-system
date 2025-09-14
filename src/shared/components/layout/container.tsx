'use client'

import { Container as ChakraContainer } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface ContainerProps {
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | 'container'
  centerContent?: boolean
  padding?: number | string
}

/**
 * コンテナコンポーネント
 */
export function Container({
  children,
  maxWidth = 'container',
  centerContent = false,
  padding
}: ContainerProps): React.ReactElement {
  return (
    <ChakraContainer maxW={maxWidth} centerContent={centerContent} p={padding}>
      {children}
    </ChakraContainer>
  )
}