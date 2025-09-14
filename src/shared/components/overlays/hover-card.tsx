'use client'

import { HoverCardArrow, HoverCardContent, HoverCardRoot, HoverCardTrigger } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface HoverCardProps {
  trigger: ReactNode
  children: ReactNode
  openDelay?: number
  closeDelay?: number
}

/**
 * ホバーカードコンポーネント
 */
export function HoverCard({ trigger, children, openDelay = 200, closeDelay = 200 }: HoverCardProps): React.ReactElement {
  return (
    <HoverCardRoot openDelay={openDelay} closeDelay={closeDelay}>
      <HoverCardTrigger asChild>{trigger}</HoverCardTrigger>
      <HoverCardContent>
        <HoverCardArrow />
        {children}
      </HoverCardContent>
    </HoverCardRoot>
  )
}