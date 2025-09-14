'use client'

import { Bleed as ChakraBleed } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface BleedProps {
  children: ReactNode
  inline?: string | number
  block?: string | number
}

/**
 * ブリードレイアウトコンポーネント
 */
export function Bleed({ children, inline, block }: BleedProps): React.ReactElement {
  return (
    <ChakraBleed inline={inline} block={block}>
      {children}
    </ChakraBleed>
  )
}