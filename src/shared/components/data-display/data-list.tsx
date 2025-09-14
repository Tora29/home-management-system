'use client'

import { DataListItem, DataListRoot } from '@chakra-ui/react'

interface DataItem {
  label: string
  value: string | React.ReactNode
}

interface DataListProps {
  items: DataItem[]
  orientation?: 'horizontal' | 'vertical'
}

/**
 * データリストコンポーネント
 */
export function DataList({ items, orientation = 'vertical' }: DataListProps): React.ReactElement {
  return (
    <DataListRoot orientation={orientation}>
      {items.map((item, index) => (
        <DataListItem key={index} label={item.label} value={item.value} />
      ))}
    </DataListRoot>
  )
}