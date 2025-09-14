'use client'

import { Box, List, Text } from '@chakra-ui/react'

import type { ReactNode } from 'react'

interface ListItem {
  id: string
  content: ReactNode
}

interface ListViewProps {
  items: ListItem[]
  emptyMessage?: string
  ordered?: boolean
  spacing?: number
}

/**
 * リストビューコンポーネント
 */
export function ListView({
  items,
  emptyMessage = 'アイテムがありません',
  ordered = false,
  spacing = 2
}: ListViewProps): React.ReactElement {
  if (items.length === 0) {
    return (
      <Box py={4}>
        <Text color="gray.500" textAlign="center">
          {emptyMessage}
        </Text>
      </Box>
    )
  }

  return (
    <List.Root as={ordered ? 'ol' : 'ul'} gap={spacing}>
      {items.map((item) => (
        <List.Item key={item.id}>
          {item.content}
        </List.Item>
      ))}
    </List.Root>
  )
}