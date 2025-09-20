'use client'

import { GridItem, Select, Portal, createListCollection } from '@chakra-ui/react'

import type { GridItemProps } from '@chakra-ui/react'
import type { Location } from '@prisma/client'

interface LocationSelectProps {
  locations: Location[]
  selectedLocation: string
  onLocationChange: (locationId: string) => void
  colSpan?: GridItemProps['colSpan']
}

/**
 * 保管場所選択コンポーネント
 */
export function LocationSelect({
  locations,
  selectedLocation,
  onLocationChange,
  colSpan,
}: LocationSelectProps): React.ReactElement {
  const locationCollection = createListCollection({
    items: [
      { label: 'すべての保管場所', value: '' },
      ...locations.map((location) => ({
        label: location.name,
        value: String(location.id),
      })),
    ],
  })

  return (
    <GridItem colSpan={colSpan || 2}>
      <Select.Root
        size="md"
        collection={locationCollection}
        value={[selectedLocation]}
        onValueChange={(e) => onLocationChange(e.value[0])}
      >
        <Select.Trigger>
          <Select.ValueText placeholder="すべての保管場所" />
          <Select.Indicator />
        </Select.Trigger>
        <Portal>
          <Select.Positioner>
            <Select.Content>
              <Select.ItemGroup>
                {locationCollection.items.map((item) => (
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
