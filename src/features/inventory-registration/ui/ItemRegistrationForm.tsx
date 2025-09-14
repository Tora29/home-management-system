'use client'

import Link from 'next/link'

import { Button, HStack, Stack, Heading, Field, Textarea } from '@chakra-ui/react'

import { CategoryLocationFields } from '@/entities/inventory/ui/CategoryLocationFields'
import { ItemFormFields } from '@/entities/inventory/ui/ItemFormFields'
import { StockManagementFields } from '@/entities/inventory/ui/StockManagementFields'

import { createItemAction } from '../api/actions'

import type { Category, Unit, Location } from '@/entities/inventory/model'

type Props = {
  categories: Category[]
  units: Unit[]
  locations: Location[]
}

/**
 * 在庫アイテム登録フォームコンポーネント
 */
export function ItemRegistrationForm({ categories, units, locations }: Props): React.ReactElement {
  async function handleAction(formData: FormData): Promise<void> {
    await createItemAction(formData)
  }

  return (
    <form action={handleAction}>
      <Stack gap={8}>
        {/* 基本情報 */}
        <Stack gap={4}>
          <Heading size="md">基本情報</Heading>
          <ItemFormFields units={units} />
        </Stack>

        {/* カテゴリ・保管場所 */}
        <Stack gap={4}>
          <Heading size="md">分類・保管</Heading>
          <CategoryLocationFields categories={categories} locations={locations} />
        </Stack>

        {/* 在庫管理 */}
        <Stack gap={4}>
          <Heading size="md">在庫管理</Heading>
          <StockManagementFields />
        </Stack>

        {/* 備考 */}
        <Stack gap={4}>
          <Heading size="md">その他</Heading>
          <Field.Root>
            <Field.Label>備考</Field.Label>
            <Textarea name="notes" placeholder="メモ・注意事項など" rows={3} />
          </Field.Root>
        </Stack>

        <HStack gap={4} justifyContent="flex-end">
          <Link href="/inventory">
            <Button variant="outline">キャンセル</Button>
          </Link>
          <Button type="submit" colorPalette="blue">
            登録
          </Button>
        </HStack>
      </Stack>
    </form>
  )
}
