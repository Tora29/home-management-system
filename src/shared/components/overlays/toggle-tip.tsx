'use client'

import { ToggleTip as ChakraToggleTip } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface ToggleTipProps {
  children: ReactNode
  content: string
  showArrow?: boolean
}

/**
 * トグルチップコンポーネント
 */
export function ToggleTip({ children, content, showArrow = true }: ToggleTipProps): React.ReactElement {
  return (
    <ChakraToggleTip content={content} showArrow={showArrow}>
      {children}
    </ChakraToggleTip>
  )
}