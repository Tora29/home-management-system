'use client'

import { Skeleton as ChakraSkeleton, SkeletonCircle as ChakraSkeletonCircle, SkeletonText } from '@chakra-ui/react'

interface SkeletonProps {
  height?: string | number
  width?: string | number
  isLoaded?: boolean
  children?: React.ReactNode
}

/**
 * スケルトンコンポーネント
 */
export function Skeleton({ height, width, isLoaded = false, children }: SkeletonProps): React.ReactElement {
  return (
    <ChakraSkeleton height={height} width={width} isLoaded={isLoaded}>
      {children}
    </ChakraSkeleton>
  )
}

/**
 * サークルスケルトンコンポーネント
 */
export function SkeletonCircle({ size = '10', isLoaded = false }: { size?: string; isLoaded?: boolean }): React.ReactElement {
  return <ChakraSkeletonCircle size={size} isLoaded={isLoaded} />
}

/**
 * テキストスケルトンコンポーネント
 */
export function SkeletonTextComponent({ noOfLines = 3, gap = 2, isLoaded = false }: { noOfLines?: number; gap?: number; isLoaded?: boolean }): React.ReactElement {
  return <SkeletonText noOfLines={noOfLines} gap={gap} isLoaded={isLoaded} />
}