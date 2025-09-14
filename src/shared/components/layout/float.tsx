'use client'

import { Float } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface FloatProps {
  children: ReactNode
  placement?: 'top-start' | 'top' | 'top-end' | 'bottom-start' | 'bottom' | 'bottom-end' | 'start' | 'end'
  offset?: { x?: number; y?: number }
}

/**
 * フローティングコンポーネント
 */
export function FloatingElement({ children, placement = 'top-end', offset }: FloatProps): React.ReactElement {
  return (
    <Float placement={placement} offsetX={offset?.x} offsetY={offset?.y}>
      {children}
    </Float>
  )
}