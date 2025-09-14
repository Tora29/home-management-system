'use client'

import { Icon as ChakraIcon } from '@chakra-ui/react'

interface IconProps {
  name?: string
  size?: string | number
  color?: string
  children?: React.ReactNode
}

/**
 * アイコンコンポーネント
 */
export function Icon({ name, size = '1em', color, children }: IconProps): React.ReactElement {
  if (children) {
    return (
      <ChakraIcon fontSize={size} color={color}>
        {children}
      </ChakraIcon>
    )
  }

  // SVGアイコンのサンプル実装
  return (
    <ChakraIcon fontSize={size} color={color}>
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
      </svg>
    </ChakraIcon>
  )
}