'use client'

import { Field, Select, createListCollection } from '@chakra-ui/react'

import type { Category, Location } from '../model'

type Props = {
  categories: Category[]
  locations: Location[]
}

/**
 * カテゴリと保管場所の選択フィールドコンポーネント
 */
export function CategoryLocationFields({ categories, locations }: Props): React.ReactElement {
  const categoryCollection = createListCollection({
    items: categories.map((category) => ({
      label: category.name,
      value: category.id,
    })),
  })

  const locationCollection = createListCollection({
    items: locations.map((location) => ({
      label: location.displayName,
      value: location.name,
    })),
  })

  return (
    <>
      <Field.Root required>
        <Field.Label>カテゴリ</Field.Label>
        <Select.Root name="categoryId" collection={categoryCollection}>
          <Select.Trigger>
            <Select.ValueText placeholder="選択してください" />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Content>
            {categories.map((category) => (
              <Select.Item key={category.id} item={category}>
                <Select.ItemText>{category.name}</Select.ItemText>
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Field.Root>

      <Field.Root>
        <Field.Label>保管場所</Field.Label>
        <Select.Root name="location" collection={locationCollection}>
          <Select.Trigger>
            <Select.ValueText placeholder="選択してください" />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Content>
            {locations.map((location) => (
              <Select.Item key={location.id} item={location}>
                <Select.ItemText>{location.displayName}</Select.ItemText>
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Field.Root>
    </>
  )
}
