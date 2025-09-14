'use client'

import { ClientOnly as ChakraClientOnly } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface ClientOnlyProps {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * クライアント専用コンポーネント
 */
export function ClientOnly({ children, fallback }: ClientOnlyProps): React.ReactElement {
  return (
    <ChakraClientOnly fallback={fallback}>
      {children}
    </ChakraClientOnly>
  )
}