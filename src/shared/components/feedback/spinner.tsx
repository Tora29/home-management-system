'use client'

import { Spinner as ChakraSpinner } from '@chakra-ui/react'

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  thickness?: string
  speed?: string
  label?: string
}

/**
 * スピナーコンポーネント
 */
export function Spinner({
  size = 'md',
  color = 'blue.500',
  thickness = '2px',
  speed = '0.65s',
  label = 'Loading...'
}: SpinnerProps): React.ReactElement {
  return (
    <ChakraSpinner
      size={size}
      color={color}
      borderWidth={thickness}
      animationDuration={speed}
      label={label}
    />
  )
}