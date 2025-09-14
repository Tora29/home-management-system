'use client'

import { LocaleProvider as ChakraLocaleProvider } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface LocaleProviderProps {
  children: ReactNode
  locale?: string
}

/**
 * ロケールプロバイダーコンポーネント
 */
export function LocaleProvider({ children, locale = 'ja-JP' }: LocaleProviderProps): React.ReactElement {
  return (
    <ChakraLocaleProvider locale={locale}>
      {children}
    </ChakraLocaleProvider>
  )
}