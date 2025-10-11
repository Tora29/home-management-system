'use client'

import { GridItem, Select, Portal, createListCollection } from '@chakra-ui/react'

import type { GridItemProps } from '@chakra-ui/react'
import type { Category } from '@prisma/client'

interface CategorySelectProps {
  categories: Category[]
  selectedCategory: string
  onCategoryChange: (categoryId: string) => void
  colSpan?: GridItemProps['colSpan']
}

/**
 * カテゴリ選択コンポーネント
 */
export function CategorySelect({
  categories,
  selectedCategory,
  onCategoryChange,
  colSpan,
}: CategorySelectProps): React.ReactElement {
  const categoryCollection = createListCollection({
    items: [
      { label: 'すべてのカテゴリ', value: '' },
      ...categories.map((category) => ({
        label: category.name,
        value: String(category.id),
      })),
    ],
  })

  return (
    <GridItem colSpan={colSpan || 2}>
      <Select.Root
        size="md"
        collection={categoryCollection}
        value={[selectedCategory]}
        onValueChange={(e) => onCategoryChange(e.value[0])}
      >
        <Select.Trigger>
          <Select.ValueText placeholder="すべてのカテゴリ" />
          <Select.Indicator />
        </Select.Trigger>
        <Portal>
          <Select.Positioner>
            <Select.Content>
              <Select.ItemGroup>
                {categoryCollection.items.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    <Select.ItemText>{item.label}</Select.ItemText>
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.ItemGroup>
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </GridItem>
  )
}
