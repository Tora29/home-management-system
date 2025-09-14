'use client'

import { ChakraProvider } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface ThemeProviderProps {
  children: ReactNode
  theme?: Record<string, any>
}

/**
 * テーマプロバイダーコンポーネント
 */
export function ThemeProvider({ children, theme }: ThemeProviderProps): React.ReactElement {
  return (
    <ChakraProvider value={theme}>
      {children}
    </ChakraProvider>
  )
}