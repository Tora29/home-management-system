'use client'

import type { ReactNode } from 'react'

interface ConditionalRenderProps {
  condition: boolean
  children: ReactNode
  fallback?: ReactNode
}

/**
 * 条件付きレンダリングコンポーネント
 */
export function ConditionalRender({
  condition,
  children,
  fallback = null
}: ConditionalRenderProps): React.ReactElement | null {
  if (condition) {
    return <>{children}</>
  }
  return <>{fallback}</>
}