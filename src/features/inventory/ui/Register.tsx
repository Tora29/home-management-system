'use client'

import { useActionState } from 'react'

import Link from 'next/link'

import { Box, Button, Container, Grid, GridItem, Heading, Text } from '@chakra-ui/react'

import { ItemFormFields } from '@/entities/inventory/ui/ItemFormFields'

import { createItemAction } from '../api/actions'

import type { Category, Unit, Location } from '@/entities/inventory/model'

type Props = {
  categories: Category[]
  units: Unit[]
  locations: Location[]
}

/**
 * 在庫アイテム登録ページのコンテンツ
 */
export function Register({ categories, units, locations }: Props): React.ReactElement {
  const [state, formAction, isPending] = useActionState(createItemAction, null)

  return (
    <Container maxW="container.xl" py={8}>
      <form action={formAction} noValidate>
        <Grid templateColumns="repeat(12, minmax(0, 1fr))" gap={6}>
          {/* ヘッダー部分 - フォームフィールドと同じ位置に配置 */}
          <GridItem colSpan={{ base: 12, lg: 8 }} colStart={{ lg: 3 }}>
            <Box mb={4}>
              <Heading size="lg" mb={2}>
                在庫アイテム登録
              </Heading>
              <Text color="gray.600">新しい在庫アイテムを登録します</Text>
            </Box>
          </GridItem>

          {/* フォームフィールドエリア - モバイル:フル幅, デスクトップ:中央8カラム */}
          <GridItem colSpan={{ base: 12, lg: 8 }} colStart={{ lg: 3 }}>
            <ItemFormFields
              categories={categories}
              units={units}
              locations={locations}
              errors={state?.errors}
            />
          </GridItem>

          {/* キャンセルボタン - 9カラム目 */}
          <GridItem colSpan={{ base: 6, lg: 1 }} colStart={{ base: 1, lg: 9 }}>
            <Link href="/inventory">
              <Button variant="outline" size="lg" width="full">
                キャンセル
              </Button>
            </Link>
          </GridItem>

          {/* 登録ボタン - 10カラム目 */}
          <GridItem colSpan={{ base: 6, lg: 1 }} colStart={{ base: 7, lg: 10 }}>
            <Button type="submit" colorPalette="blue" size="lg" width="full" disabled={isPending}>
              {isPending ? '登録中...' : '登録'}
            </Button>
          </GridItem>
        </Grid>
      </form>
    </Container>
  )
}
