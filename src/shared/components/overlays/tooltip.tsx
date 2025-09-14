'use client'

import { Tooltip as ChakraTooltip } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface TooltipProps {
  children: ReactNode
  content: string
  placement?: 'top' | 'right' | 'bottom' | 'left'
  showArrow?: boolean
}

/**
 * ツールチップコンポーネント
 */
export function Tooltip({ children, content, placement = 'top', showArrow = true }: TooltipProps): React.ReactElement {
  return (
    <ChakraTooltip content={content} placement={placement} showArrow={showArrow}>
      {children}
    </ChakraTooltip>
  )
}