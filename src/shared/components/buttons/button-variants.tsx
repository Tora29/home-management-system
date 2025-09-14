'use client'

import { Button, CloseButton as ChakraCloseButton, IconButton as ChakraIconButton } from '@chakra-ui/react'

import type { ReactNode } from 'react'

/**
 * 閉じるボタンコンポーネント
 */
export function CloseButton({
  onClick,
  size = 'md',
  ariaLabel = '閉じる'
}: {
  onClick?: () => void
  size?: 'xs' | 'sm' | 'md' | 'lg'
  ariaLabel?: string
}): React.ReactElement {
  return <ChakraCloseButton onClick={onClick} size={size} aria-label={ariaLabel} />
}

/**
 * アイコンボタンコンポーネント
 */
export function IconButton({
  icon,
  onClick,
  ariaLabel,
  variant = 'solid',
  colorScheme = 'gray',
  size = 'md'
}: {
  icon: ReactNode
  onClick?: () => void
  ariaLabel: string
  variant?: 'solid' | 'outline' | 'ghost' | 'subtle'
  colorScheme?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}): React.ReactElement {
  return (
    <ChakraIconButton
      aria-label={ariaLabel}
      onClick={onClick}
      variant={variant}
      colorScheme={colorScheme}
      size={size}
    >
      {icon}
    </ChakraIconButton>
  )
}

/**
 * ダウンロードトリガーコンポーネント
 */
export function DownloadButton({
  children,
  fileName,
  href,
  variant = 'solid',
  colorScheme = 'blue'
}: {
  children: ReactNode
  fileName: string
  href: string
  variant?: string
  colorScheme?: string
}): React.ReactElement {
  return (
    <Button asChild variant={variant} colorScheme={colorScheme}>
      <a href={href} download={fileName}>
        {children}
      </a>
    </Button>
  )
}