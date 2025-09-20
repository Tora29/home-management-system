'use client'

import {
  Field,
  Grid,
  GridItem,
  Input,
  Textarea,
  Select,
  Portal,
  createListCollection,
} from '@chakra-ui/react'

import type { ItemFormFieldsProps } from '../model'

/**
 * 在庫アイテムの全フォームフィールド統合コンポーネント
 */
export function ItemFormFields({
  categories,
  units,
  locations,
  errors,
}: ItemFormFieldsProps): React.ReactElement {
  const categoryCollection = createListCollection({
    items: categories.map((category) => ({
      label: category.name,
      value: category.id,
    })),
  })

  const unitCollection = createListCollection({
    items: units.map((unit) => ({
      label: unit.displayName,
      value: unit.id,
    })),
  })

  const locationCollection = createListCollection({
    items: locations.map((location) => ({
      label: location.displayName,
      value: location.id,
    })),
  })

  return (
    <Grid templateColumns="repeat(2, minmax(0, 1fr))" gap={4}>
      {/* 基本情報 - フル幅 */}
      <GridItem colSpan={2}>
        <Field.Root required invalid={!!errors?.name}>
          <Field.Label>
            アイテム名
            <Field.RequiredIndicator />
          </Field.Label>
          <Input name="name" placeholder="例: トイレットペーパー" />
          <Field.ErrorText>{errors?.name}</Field.ErrorText>
        </Field.Root>
      </GridItem>

      <GridItem colSpan={2}>
        <Field.Root>
          <Field.Label>説明</Field.Label>
          <Textarea name="description" placeholder="アイテムの説明（任意）" />
        </Field.Root>
      </GridItem>

      {/* 数量と単位 - 2カラム */}
      <GridItem colSpan={{ base: 2, md: 1 }}>
        <Field.Root required invalid={!!errors?.quantity}>
          <Field.Label>
            数量
            <Field.RequiredIndicator />
          </Field.Label>
          <Input name="quantity" type="number" min="0" step="1" placeholder="1" />
          <Field.ErrorText>{errors?.quantity}</Field.ErrorText>
        </Field.Root>
      </GridItem>

      <GridItem colSpan={{ base: 2, md: 1 }}>
        <Field.Root required invalid={!!errors?.unitId}>
          <Field.Label>
            単位
            <Field.RequiredIndicator />
          </Field.Label>
          <Select.Root name="unitId" collection={unitCollection}>
            <Select.HiddenSelect />
            <Select.Trigger>
              <Select.ValueText placeholder="選択してください" />
              <Select.Indicator />
            </Select.Trigger>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  <Select.ItemGroup>
                    {unitCollection.items.map((unit) => (
                      <Select.Item key={unit.value} item={unit}>
                        <Select.ItemText>{unit.label}</Select.ItemText>
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.ItemGroup>
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
          <Field.ErrorText>{errors?.unitId}</Field.ErrorText>
        </Field.Root>
      </GridItem>

      {/* カテゴリ・保管場所 - 2カラム */}
      <GridItem colSpan={{ base: 2, md: 1 }}>
        <Field.Root required invalid={!!errors?.categoryId}>
          <Field.Label>
            カテゴリ
            <Field.RequiredIndicator />
          </Field.Label>
          <Select.Root name="categoryId" collection={categoryCollection}>
            <Select.HiddenSelect />
            <Select.Trigger>
              <Select.ValueText placeholder="選択してください" />
              <Select.Indicator />
            </Select.Trigger>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  <Select.ItemGroup>
                    {categoryCollection.items.map((category) => (
                      <Select.Item key={category.value} item={category}>
                        <Select.ItemText>{category.label}</Select.ItemText>
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.ItemGroup>
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
          <Field.ErrorText>{errors?.categoryId}</Field.ErrorText>
        </Field.Root>
      </GridItem>

      <GridItem colSpan={{ base: 2, md: 1 }}>
        <Field.Root invalid={!!errors?.locationId}>
          <Field.Label>保管場所</Field.Label>
          <Select.Root name="locationId" collection={locationCollection}>
            <Select.HiddenSelect />
            <Select.Trigger>
              <Select.ValueText placeholder="選択してください" />
              <Select.Indicator />
            </Select.Trigger>
            <Portal>
              <Select.Positioner>
                <Select.Content>
                  <Select.ItemGroup>
                    {locationCollection.items.map((location) => (
                      <Select.Item key={location.value} item={location}>
                        <Select.ItemText>{location.label}</Select.ItemText>
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.ItemGroup>
                </Select.Content>
              </Select.Positioner>
            </Portal>
          </Select.Root>
          <Field.ErrorText>{errors?.locationId}</Field.ErrorText>
        </Field.Root>
      </GridItem>

      {/* バーコード - フル幅 */}
      <GridItem colSpan={2}>
        <Field.Root>
          <Field.Label>バーコード</Field.Label>
          <Input name="barcode" placeholder="JANコードなど" />
        </Field.Root>
      </GridItem>

      {/* 備考 - フル幅 */}
      <GridItem colSpan={2}>
        <Field.Root>
          <Field.Label>備考</Field.Label>
          <Textarea name="notes" placeholder="メモ・注意事項など" rows={3} />
        </Field.Root>
      </GridItem>
    </Grid>
  )
}
