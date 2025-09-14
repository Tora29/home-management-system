'use client'

import { DrawerBackdrop, DrawerBody, DrawerCloseTrigger, DrawerContent, DrawerFooter, DrawerHeader, DrawerRoot, DrawerTitle, DrawerTrigger } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface DrawerProps {
  trigger: ReactNode
  title: string
  children: ReactNode
  footer?: ReactNode
  placement?: 'top' | 'right' | 'bottom' | 'left'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  isOpen?: boolean
  onClose?: () => void
}

/**
 * ドロワーコンポーネント
 */
export function Drawer({
  trigger,
  title,
  children,
  footer,
  placement = 'right',
  size = 'md',
  isOpen,
  onClose
}: DrawerProps): React.ReactElement {
  return (
    <DrawerRoot placement={placement} size={size} open={isOpen} onOpenChange={onClose}>
      <DrawerBackdrop />
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerCloseTrigger />
        </DrawerHeader>
        <DrawerBody>{children}</DrawerBody>
        {footer && <DrawerFooter>{footer}</DrawerFooter>}
      </DrawerContent>
    </DrawerRoot>
  )
}