'use client'

import { AspectRatio as ChakraAspectRatio } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface AspectRatioProps {
  ratio: number
  children: ReactNode
  maxWidth?: string | number
}

/**
 * アスペクト比コンポーネント
 */
export function AspectRatio({ ratio, children, maxWidth }: AspectRatioProps): React.ReactElement {
  return (
    <ChakraAspectRatio ratio={ratio} maxW={maxWidth}>
      {children}
    </ChakraAspectRatio>
  )
}