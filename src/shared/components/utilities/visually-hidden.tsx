'use client'

import { VisuallyHidden as ChakraVisuallyHidden } from '@chakra-ui/react'

interface VisuallyHiddenProps {
  children: React.ReactNode
}

/**
 * 視覚的に非表示コンポーネント（スクリーンリーダー用）
 */
export function VisuallyHidden({ children }: VisuallyHiddenProps): React.ReactElement {
  return <ChakraVisuallyHidden>{children}</ChakraVisuallyHidden>
}