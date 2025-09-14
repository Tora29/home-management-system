'use client'

import { SimpleGrid as ChakraSimpleGrid } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface SimpleGridProps {
  children: ReactNode
  columns?: number | { base?: number; sm?: number; md?: number; lg?: number; xl?: number }
  spacing?: number | string
  minChildWidth?: string | number
}

/**
 * シンプルグリッドコンポーネント
 */
export function SimpleGrid({ children, columns, spacing = 4, minChildWidth }: SimpleGridProps): React.ReactElement {
  return (
    <ChakraSimpleGrid columns={columns} gap={spacing} minChildWidth={minChildWidth}>
      {children}
    </ChakraSimpleGrid>
  )
}