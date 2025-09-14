'use client'

import { Button, ClipboardIconButton, ClipboardInput, ClipboardRoot } from '@chakra-ui/react'

interface ClipboardProps {
  value: string
  timeout?: number
  label?: string
}

/**
 * クリップボードコンポーネント
 */
export function Clipboard({ value, timeout = 2000, label = 'Copy' }: ClipboardProps): React.ReactElement {
  return (
    <ClipboardRoot value={value} timeout={timeout}>
      <ClipboardInput />
      <ClipboardIconButton />
    </ClipboardRoot>
  )
}

/**
 * クリップボードボタンコンポーネント
 */
export function ClipboardButton({ value, timeout = 2000, label = 'Copy' }: ClipboardProps): React.ReactElement {
  return (
    <ClipboardRoot value={value} timeout={timeout}>
      <Button size="sm">
        {label}
      </Button>
    </ClipboardRoot>
  )
}