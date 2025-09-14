'use client'

import { Box } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface ScrollAreaProps {
  children: ReactNode
  height?: string | number
  maxHeight?: string | number
  width?: string | number
  maxWidth?: string | number
}

/**
 * スクロールエリアコンポーネント
 */
export function ScrollArea({ children, height, maxHeight, width, maxWidth }: ScrollAreaProps): React.ReactElement {
  return (
    <Box
      overflowY="auto"
      overflowX="hidden"
      h={height}
      maxH={maxHeight}
      w={width}
      maxW={maxWidth}
    >
      {children}
    </Box>
  )
}