'use client'

import { Button, DialogActionTrigger, DialogBackdrop, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogTrigger } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface DialogProps {
  trigger?: ReactNode
  title: string
  children: ReactNode
  footer?: ReactNode
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full'
  isCentered?: boolean
  closeOnOverlayClick?: boolean
}

/**
 * ダイアログコンポーネント
 */
export function Dialog({
  trigger,
  title,
  children,
  footer,
  isOpen,
  onOpenChange,
  size = 'md',
  isCentered = true,
  closeOnOverlayClick = true
}: DialogProps): React.ReactElement {
  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={onOpenChange}
      size={size}
      placement={isCentered ? 'center' : 'top'}
      closeOnInteractOutside={closeOnOverlayClick}
    >
      <DialogBackdrop />
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogCloseTrigger />
        </DialogHeader>
        <DialogBody>{children}</DialogBody>
        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </DialogRoot>
  )
}