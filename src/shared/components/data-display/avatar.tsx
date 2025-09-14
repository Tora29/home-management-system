'use client'

import { Avatar as ChakraAvatar, AvatarGroup as ChakraAvatarGroup } from '@chakra-ui/react'

interface AvatarProps {
  name?: string
  src?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  shape?: 'square' | 'rounded' | 'full'
}

/**
 * アバターコンポーネント
 */
export function Avatar({ name, src, size = 'md', shape = 'full' }: AvatarProps): React.ReactElement {
  return <ChakraAvatar name={name} src={src} size={size} shape={shape} />
}

interface AvatarGroupProps {
  children: React.ReactNode
  max?: number
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
}

/**
 * アバターグループコンポーネント
 */
export function AvatarGroup({ children, max, size = 'md' }: AvatarGroupProps): React.ReactElement {
  return (
    <ChakraAvatarGroup max={max} size={size}>
      {children}
    </ChakraAvatarGroup>
  )
}