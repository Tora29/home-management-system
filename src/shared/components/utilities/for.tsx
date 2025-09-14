'use client'

import { For as ChakraFor } from '@chakra-ui/react'

interface ForProps<T> {
  each: T[]
  fallback?: React.ReactNode
  children: (item: T, index: number) => React.ReactNode
}

/**
 * リスト反復コンポーネント
 */
export function For<T>({ each, fallback, children }: ForProps<T>): React.ReactElement {
  return (
    <ChakraFor each={each} fallback={fallback}>
      {children}
    </ChakraFor>
  )
}