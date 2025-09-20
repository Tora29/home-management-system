'use client'

import { Table as ChakraTable, Badge, HStack, Text, GridItem, Box } from '@chakra-ui/react'

import type { TableProps } from '../model'

/**
 * 在庫テーブルコンポーネント
 *
 * @returns テーブルUI
 */
export function Table({ items, isLoading = false, colSpan }: TableProps): React.ReactElement {
  if (isLoading) {
    return (
      <GridItem colSpan={colSpan || 12}>
        <Box py={8} textAlign="center">
          <Text>読み込み中...</Text>
        </Box>
      </GridItem>
    )
  }

  if (items.length === 0) {
    return (
      <GridItem colSpan={colSpan || 12}>
        <Box py={8} textAlign="center">
          <Text color="gray.600">在庫アイテムがありません</Text>
        </Box>
      </GridItem>
    )
  }

  return (
    <GridItem colSpan={colSpan || 12}>
      <ChakraTable.ScrollArea borderWidth="1px" rounded="md">
        <ChakraTable.Root size="sm" variant="outline" interactive>
          <ChakraTable.Header>
            <ChakraTable.Row>
              <ChakraTable.ColumnHeader>商品名</ChakraTable.ColumnHeader>
              <ChakraTable.ColumnHeader textAlign="center">カテゴリ</ChakraTable.ColumnHeader>
              <ChakraTable.ColumnHeader textAlign="center">数量</ChakraTable.ColumnHeader>
              <ChakraTable.ColumnHeader>単位</ChakraTable.ColumnHeader>
              <ChakraTable.ColumnHeader>保管場所</ChakraTable.ColumnHeader>
              <ChakraTable.ColumnHeader>バーコード</ChakraTable.ColumnHeader>
              <ChakraTable.ColumnHeader>更新日</ChakraTable.ColumnHeader>
            </ChakraTable.Row>
          </ChakraTable.Header>
          <ChakraTable.Body>
            {items.map((item, index) => (
              <ChakraTable.Row key={item.id} bg={index % 2 === 0 ? 'gray.50' : undefined}>
                <ChakraTable.Cell>
                  <Text fontWeight="medium">{item.name}</Text>
                  {item.description && (
                    <Text fontSize="sm" color="gray.600" truncate maxW="200px">
                      {item.description}
                    </Text>
                  )}
                </ChakraTable.Cell>
                <ChakraTable.Cell textAlign="center">
                  <Badge colorPalette="blue" size="sm">
                    {item.category.name}
                  </Badge>
                </ChakraTable.Cell>
                <ChakraTable.Cell textAlign="center">
                  <HStack gap={1} justify="center">
                    <Text fontWeight="bold">{item.quantity}</Text>
                  </HStack>
                </ChakraTable.Cell>
                <ChakraTable.Cell>{item.unitDisplayName || item.unit}</ChakraTable.Cell>
                <ChakraTable.Cell>
                  {item.locationDisplayName || item.location || '-'}
                </ChakraTable.Cell>
                <ChakraTable.Cell>
                  <Text fontSize="sm" fontFamily="mono">
                    {item.barcode || '-'}
                  </Text>
                </ChakraTable.Cell>
                <ChakraTable.Cell>
                  <Text fontSize="sm">{new Date(item.updatedAt).toLocaleDateString('ja-JP')}</Text>
                </ChakraTable.Cell>
              </ChakraTable.Row>
            ))}
          </ChakraTable.Body>
        </ChakraTable.Root>
      </ChakraTable.ScrollArea>
    </GridItem>
  )
}
