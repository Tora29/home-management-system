'use client'

import { ChakraProvider } from '@chakra-ui/react'
import { system } from '@/shared/theme'

/**
 * Chakra UIプロバイダーコンポーネント
 * カスタムテーマ（Silver Color Palettes）を適用
 */
export function Providers({ children }: { children: React.ReactNode }): React.ReactElement {
  return <ChakraProvider value={system}>{children}</ChakraProvider>
}
