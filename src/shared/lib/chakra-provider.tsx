'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

// import { theme } from './chakra-theme'

/**
 * Chakra UIプロバイダーコンポーネント
 */
export function Providers({ children }: { children: React.ReactNode }): React.ReactElement {
  return <ChakraProvider value={defaultSystem}>{children}</ChakraProvider>
}
