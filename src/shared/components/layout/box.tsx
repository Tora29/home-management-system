'use client'

import { Box as ChakraBox } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface BoxProps {
  children: ReactNode
  as?: React.ElementType
  padding?: number | string
  margin?: number | string
  background?: string
  color?: string
  width?: string | number
  height?: string | number
  display?: string
  position?: 'relative' | 'absolute' | 'fixed' | 'sticky'
}

/**
 * ボックスコンポーネント
 */
export function Box({
  children,
  as,
  padding,
  margin,
  background,
  color,
  width,
  height,
  display,
  position
}: BoxProps): React.ReactElement {
  return (
    <ChakraBox
      as={as}
      p={padding}
      m={margin}
      bg={background}
      color={color}
      w={width}
      h={height}
      display={display}
      position={position}
    >
      {children}
    </ChakraBox>
  )
}