'use client'

import { EnvironmentProvider as ChakraEnvironmentProvider } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface EnvironmentProviderProps {
  children: ReactNode
  environment?: Window | Document
}

/**
 * 環境プロバイダーコンポーネント
 */
export function EnvironmentProvider({ children, environment }: EnvironmentProviderProps): React.ReactElement {
  return (
    <ChakraEnvironmentProvider environment={environment}>
      {children}
    </ChakraEnvironmentProvider>
  )
}