'use client'

import { Table as ChakraTable } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface TableProps {
  children: ReactNode
  variant?: 'simple' | 'striped' | 'unstyled'
  size?: 'sm' | 'md' | 'lg'
  colorScheme?: string
}

/**
 * テーブルコンポーネント
 */
export function Table({ children, variant = 'simple', size = 'md', colorScheme }: TableProps): React.ReactElement {
  return (
    <ChakraTable.Root variant={variant} size={size} colorScheme={colorScheme}>
      {children}
    </ChakraTable.Root>
  )
}

export const TableHeader = ChakraTable.Header
export const TableBody = ChakraTable.Body
export const TableFooter = ChakraTable.Footer
export const TableRow = ChakraTable.Row
export const TableCell = ChakraTable.Cell
export const TableColumnHeader = ChakraTable.ColumnHeader
export const TableCaption = ChakraTable.Caption