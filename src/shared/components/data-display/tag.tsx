'use client'

import { Tag as ChakraTag, TagCloseTrigger, TagLabel } from '@chakra-ui/react'

interface TagProps {
  label: string
  onClose?: () => void
  colorScheme?: string
  variant?: 'solid' | 'subtle' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

/**
 * タグコンポーネント
 */
export function Tag({ label, onClose, colorScheme = 'gray', variant = 'subtle', size = 'md' }: TagProps): React.ReactElement {
  return (
    <ChakraTag colorScheme={colorScheme} variant={variant} size={size}>
      <TagLabel>{label}</TagLabel>
      {onClose && <TagCloseTrigger onClick={onClose} />}
    </ChakraTag>
  )
}