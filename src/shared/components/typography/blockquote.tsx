'use client'

import { Blockquote as ChakraBlockquote } from '@chakra-ui/react'

interface BlockquoteProps {
  children: React.ReactNode
  cite?: string
  icon?: React.ReactNode
}

/**
 * 引用ブロックコンポーネント
 */
export function Blockquote({ children, cite, icon }: BlockquoteProps): React.ReactElement {
  return (
    <ChakraBlockquote cite={cite} icon={icon}>
      {children}
    </ChakraBlockquote>
  )
}