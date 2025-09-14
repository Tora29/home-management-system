'use client'

import { Show as ChakraShow } from '@chakra-ui/react'

interface ShowProps {
  when: boolean
  fallback?: React.ReactNode
  children: React.ReactNode
}

/**
 * 条件表示コンポーネント
 */
export function Show({ when, fallback, children }: ShowProps): React.ReactElement {
  return (
    <ChakraShow when={when} fallback={fallback}>
      {children}
    </ChakraShow>
  )
}