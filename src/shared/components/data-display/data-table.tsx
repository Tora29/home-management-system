'use client'

import { Table } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface TableColumn<T> {
  key: string
  header: string
  accessor: keyof T | ((item: T) => ReactNode)
  align?: 'left' | 'center' | 'right'
}

interface DataTableProps<T> {
  columns: TableColumn<T>[]
  data: T[]
  striped?: boolean
  hoverable?: boolean
  size?: 'sm' | 'md' | 'lg'
}

/**
 * データテーブルコンポーネント
 */
export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  striped = true,
  hoverable = true,
  size = 'md'
}: DataTableProps<T>): React.ReactElement {
  const getCellValue = (item: T, column: TableColumn<T>): ReactNode => {
    if (typeof column.accessor === 'function') {
      return column.accessor(item)
    }
    return String(item[column.accessor])
  }

  return (
    <Table.Root size={size} striped={striped} interactive={hoverable}>
      <Table.Header>
        <Table.Row>
          {columns.map((column) => (
            <Table.ColumnHeader key={column.key} textAlign={column.align}>
              {column.header}
            </Table.ColumnHeader>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.map((item) => (
          <Table.Row key={item.id}>
            {columns.map((column) => (
              <Table.Cell key={column.key} textAlign={column.align}>
                {getCellValue(item, column)}
              </Table.Cell>
            ))}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  )
}