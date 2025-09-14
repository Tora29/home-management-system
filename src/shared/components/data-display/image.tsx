'use client'

import { Image as ChakraImage } from '@chakra-ui/react'

interface ImageProps {
  src: string
  alt: string
  width?: string | number
  height?: string | number
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  borderRadius?: string
  fallbackSrc?: string
}

/**
 * 画像コンポーネント
 */
export function Image({
  src,
  alt,
  width,
  height,
  objectFit = 'cover',
  borderRadius,
  fallbackSrc
}: ImageProps): React.ReactElement {
  return (
    <ChakraImage
      src={src}
      alt={alt}
      w={width}
      h={height}
      objectFit={objectFit}
      borderRadius={borderRadius}
      fallbackSrc={fallbackSrc}
    />
  )
}