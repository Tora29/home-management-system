'use client'

import { SimpleGrid, Text } from '@chakra-ui/react'

import { ItemCard } from '@/shared/components/data-display/item-card'
import { StatusBadge } from '@/shared/components/data-display/status-badge'
import { EmptyState } from '@/shared/components/feedback/empty-state'
import { PageContainer } from '@/shared/components/layout/page-container'
import { DateDisplay } from '@/shared/components/ui/date-display'
import { PageHeader } from '@/shared/components/ui/page-header'

import type { ItemWithRelations } from '@/entities/item/model'

interface InventoryListProps {
  items: ItemWithRelations[]
}

/**
 * 在庫アイテム一覧コンポーネント
 */
export function InventoryList({ items }: InventoryListProps): React.ReactElement {
  return (
    <PageContainer>
      <PageHeader
        title="在庫一覧"
        action={{
          label: '新規登録',
          icon: '➕',
          href: '/inventory/register',
        }}
      />

      {items.length === 0 ? (
        <EmptyState
          icon="📦"
          title="在庫アイテムがありません"
          action={{
            label: '➕ 最初のアイテムを登録する',
            href: '/inventory/register',
          }}
        />
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={4}>
          {items.map((item) => (
            <ItemCard
              key={item.id}
              title={item.name}
              badge={
                item.category.icon
                  ? {
                      label: `${item.category.icon} ${item.category.name}`,
                      colorScheme: 'teal',
                    }
                  : undefined
              }
              status={{
                value: item.quantity,
                unit: item.unit,
                colorScheme: item.quantity > 0 ? 'green' : 'red',
              }}
              details={[
                item.location
                  ? { label: '保管場所', value: item.location }
                  : null,
                item.expiryDate
                  ? { label: '期限', value: <DateDisplay date={item.expiryDate} label="" icon="" /> }
                  : null,
                item.minimumStock
                  ? {
                      label: '最小在庫',
                      value: (
                        <StatusBadge
                          value={item.minimumStock}
                          unit={item.unit}
                          colorScheme={item.quantity <= item.minimumStock ? 'orange' : 'gray'}
                          size="sm"
                        />
                      ),
                    }
                  : null,
                item.notes
                  ? {
                      label: '備考',
                      value: (
                        <Text fontSize="xs" lineClamp={2}>
                          {item.notes}
                        </Text>
                      ),
                    }
                  : null,
              ].filter(Boolean) as Array<{ label: string; value: string | React.ReactNode; icon?: string }>}
              footer={{
                leftContent: (
                  <Text fontSize="xs" color="gray.500">
                    更新: {new Date(item.updatedAt).toLocaleDateString('ja-JP')}
                  </Text>
                ),
                actions: [
                  { label: '編集', colorScheme: 'blue' },
                  { label: '削除', colorScheme: 'red' },
                ],
              }}
            />
          ))}
        </SimpleGrid>
      )}
    </PageContainer>
  )
}