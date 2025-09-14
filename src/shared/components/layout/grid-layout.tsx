'use client'

import { Grid, GridItem } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface GridLayoutProps {
  children: ReactNode
  columns?: number | { base?: number; sm?: number; md?: number; lg?: number; xl?: number }
  gap?: number | string
  templateColumns?: string
  templateRows?: string
}

/**
 * グリッドレイアウトコンポーネント
 */
export function GridLayout({
  children,
  columns,
  gap = 4,
  templateColumns,
  templateRows
}: GridLayoutProps): React.ReactElement {
  const getTemplateColumns = (): string | object | undefined => {
    if (templateColumns) return templateColumns
    if (typeof columns === 'number') return `repeat(${columns}, 1fr)`
    if (typeof columns === 'object') {
      return {
        base: columns.base ? `repeat(${columns.base}, 1fr)` : '1fr',
        sm: columns.sm ? `repeat(${columns.sm}, 1fr)` : undefined,
        md: columns.md ? `repeat(${columns.md}, 1fr)` : undefined,
        lg: columns.lg ? `repeat(${columns.lg}, 1fr)` : undefined,
        xl: columns.xl ? `repeat(${columns.xl}, 1fr)` : undefined,
      }
    }
    return undefined
  }

  return (
    <Grid
      templateColumns={getTemplateColumns()}
      templateRows={templateRows}
      gap={gap}
    >
      {children}
    </Grid>
  )
}

export { GridItem }