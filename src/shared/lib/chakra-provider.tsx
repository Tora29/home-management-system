'use client'

import { ChakraProvider } from '@chakra-ui/react'

import { Toaster } from '@/shared/components/ui/toaster'

import { theme } from './chakra-theme'

/**
 * Chakra UIプロバイダーコンポーネント
 */
export function Providers({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <ChakraProvider value={theme}>
      {children}
      <Toaster />
    </ChakraProvider>
  )
}