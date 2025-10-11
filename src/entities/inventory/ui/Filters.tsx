'use client'

import { Grid, GridItem, NativeSelect } from '@chakra-ui/react'

import type { FiltersProps } from '../model'

/**
 * 在庫フィルターコンポーネント
 *
 * @returns フィルターUI
 */
export function Filters({
  categories,
  locations,
  selectedCategory,
  selectedLocation,
  onCategoryChange,
  onLocationChange,
  colSpan,
}: FiltersProps): React.ReactElement {
  return (
    <GridItem colSpan={colSpan || { base: 12, md: 6 }}>
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem colSpan={{ base: 2, sm: 1 }}>
          <NativeSelect.Root size="sm" width="full">
            <NativeSelect.Field
              placeholder="すべてのカテゴリ"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.currentTarget.value)}
            >
              <option value="">すべてのカテゴリ</option>
              {categories.map((category) => (
                <option key={String(category.id)} value={String(category.id)}>
                  {category.name}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </GridItem>

        <GridItem colSpan={{ base: 2, sm: 1 }}>
          <NativeSelect.Root size="sm" width="full">
            <NativeSelect.Field
              placeholder="すべての保管場所"
              value={selectedLocation}
              onChange={(e) => onLocationChange(e.currentTarget.value)}
            >
              <option value="">すべての保管場所</option>
              {locations.map((location) => (
                <option key={String(location.id)} value={String(location.id)}>
                  {location.name}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
        </GridItem>
      </Grid>
    </GridItem>
  )
}
