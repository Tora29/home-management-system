'use client'

import { Card as ChakraCard } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  variant?: 'elevated' | 'outline' | 'subtle'
  size?: 'sm' | 'md' | 'lg'
}

/**
 * カードコンポーネント
 */
export function Card({ children, variant = 'outline', size = 'md' }: CardProps): React.ReactElement {
  return (
    <ChakraCard.Root variant={variant} size={size}>
      {children}
    </ChakraCard.Root>
  )
}

export const CardHeader = ChakraCard.Header
export const CardBody = ChakraCard.Body
export const CardFooter = ChakraCard.Footer
export const CardTitle = ChakraCard.Title
export const CardDescription = ChakraCard.Description