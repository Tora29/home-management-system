'use client'

import {
  Field,
  Grid,
  GridItem,
  Input,
  Textarea,
  Select,
  createListCollection,
} from '@chakra-ui/react'

import type { Unit } from '../model'

/**
 * アイテムの基本情報入力フィールド群のProps
 */
type Props = {
  units: Unit[]
}

/**
 * アイテムの基本情報入力フィールド群
 */
export function ItemFormFields({ units }: Props): React.ReactElement {
  const unitCollection = createListCollection({
    items: units.map((unit) => ({
      label: unit.displayName,
      value: unit.name,
    })),
  })

  return (
    <>
      <Field.Root required>
        <Field.Label>アイテム名</Field.Label>
        <Input name="name" placeholder="例: トイレットペーパー" />
      </Field.Root>

      <Field.Root>
        <Field.Label>説明</Field.Label>
        <Textarea name="description" placeholder="アイテムの説明（任意）" />
      </Field.Root>

      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <Field.Root required>
            <Field.Label>数量</Field.Label>
            <Input name="quantity" type="number" min="0" step="0.01" placeholder="0" />
          </Field.Root>
        </GridItem>

        <GridItem>
          <Field.Root required>
            <Field.Label>単位</Field.Label>
            <Select.Root name="unit" collection={unitCollection}>
              <Select.Trigger>
                <Select.ValueText placeholder="選択してください" />
                <Select.Indicator />
              </Select.Trigger>
              <Select.Content>
                {units.map((unit) => (
                  <Select.Item key={unit.id} item={unit}>
                    <Select.ItemText>{unit.displayName}</Select.ItemText>
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </Field.Root>
        </GridItem>
      </Grid>
    </>
  )
}
