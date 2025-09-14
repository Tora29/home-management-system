'use client'

import { PopoverArrow, PopoverBody, PopoverCloseTrigger, PopoverContent, PopoverHeader, PopoverRoot, PopoverTitle, PopoverTrigger } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface PopoverProps {
  trigger: ReactNode
  title?: string
  children: ReactNode
  placement?: 'top' | 'right' | 'bottom' | 'left'
}

/**
 * ポップオーバーコンポーネント
 */
export function Popover({ trigger, title, children, placement = 'bottom' }: PopoverProps): React.ReactElement {
  return (
    <PopoverRoot placement={placement}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        {title && (
          <PopoverHeader>
            <PopoverTitle>{title}</PopoverTitle>
          </PopoverHeader>
        )}
        <PopoverBody>{children}</PopoverBody>
        <PopoverCloseTrigger />
      </PopoverContent>
    </PopoverRoot>
  )
}