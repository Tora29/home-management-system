'use client'

import { Button, IconButton } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface ActionButtonProps {
  label?: string
  icon?: string | ReactNode
  onClick?: () => void
  href?: string
  variant?: 'solid' | 'outline' | 'ghost' | 'subtle' | 'surface'
  colorScheme?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  isLoading?: boolean
  loadingText?: string
  isDisabled?: boolean
  iconOnly?: boolean
  ariaLabel?: string
}

/**
 * アクションボタンコンポーネント
 */
export function ActionButton({
  label,
  icon,
  onClick,
  href,
  variant = 'solid',
  colorScheme = 'blue',
  size = 'md',
  isLoading = false,
  loadingText,
  isDisabled = false,
  iconOnly = false,
  ariaLabel
}: ActionButtonProps): React.ReactElement {
  if (iconOnly && icon) {
    return (
      <IconButton
        aria-label={ariaLabel || label || 'action'}
        onClick={onClick}
        variant={variant}
        colorScheme={colorScheme}
        size={size}
        disabled={isDisabled || isLoading}
      >
        {typeof icon === 'string' ? <span>{icon}</span> : icon}
      </IconButton>
    )
  }

  return (
    <Button
      asChild={!!href}
      onClick={onClick}
      variant={variant}
      colorScheme={colorScheme}
      size={size}
      loading={isLoading}
      loadingText={loadingText}
      disabled={isDisabled}
    >
      {href ? (
        <a href={href}>
          {icon && (typeof icon === 'string' ? `${icon} ` : icon)}
          {label}
        </a>
      ) : (
        <>
          {icon && (typeof icon === 'string' ? `${icon} ` : icon)}
          {label}
        </>
      )}
    </Button>
  )
}