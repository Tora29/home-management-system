'use client'

import { Button, DialogActionTrigger, DialogBody, DialogCloseTrigger, DialogContent, DialogFooter, DialogHeader, DialogRoot, DialogTitle, DialogTrigger } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface ConfirmDialogProps {
  trigger: ReactNode
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onCancel?: () => void
  colorScheme?: string
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

/**
 * 確認ダイアログコンポーネント
 */
export function ConfirmDialog({
  trigger,
  title,
  message,
  confirmLabel = '確認',
  cancelLabel = 'キャンセル',
  onConfirm,
  onCancel,
  colorScheme = 'red',
  isOpen,
  onOpenChange
}: ConfirmDialogProps): React.ReactElement {
  return (
    <DialogRoot open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogBody>
          {message}
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button variant="outline" onClick={onCancel}>
              {cancelLabel}
            </Button>
          </DialogActionTrigger>
          <Button colorScheme={colorScheme} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  )
}