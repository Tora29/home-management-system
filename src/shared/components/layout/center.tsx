'use client'

import { AbsoluteCenter, Center as ChakraCenter } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface CenterProps {
  children: ReactNode
  height?: string | number
  width?: string | number
}

/**
 * センタリングコンポーネント
 */
export function Center({ children, height, width }: CenterProps): React.ReactElement {
  return (
    <ChakraCenter h={height} w={width}>
      {children}
    </ChakraCenter>
  )
}

interface AbsoluteCenterProps {
  children: ReactNode
  axis?: 'horizontal' | 'vertical' | 'both'
}

/**
 * 絶対センタリングコンポーネント
 */
export function CenterAbsolute({ children, axis = 'both' }: AbsoluteCenterProps): React.ReactElement {
  return (
    <AbsoluteCenter axis={axis}>
      {children}
    </AbsoluteCenter>
  )
}