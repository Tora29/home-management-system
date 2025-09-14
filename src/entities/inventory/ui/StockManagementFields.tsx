'use client'

import { Field, Grid, GridItem, Input } from '@chakra-ui/react'

/**
 * 在庫管理に関する入力フィールドコンポーネント
 */
export function StockManagementFields(): React.ReactElement {
  return (
    <>
      <Grid templateColumns="repeat(2, 1fr)" gap={4}>
        <GridItem>
          <Field.Root>
            <Field.Label>最小在庫数</Field.Label>
            <Input name="minimumStock" type="number" min="0" step="0.01" placeholder="0" />
          </Field.Root>
        </GridItem>

        <GridItem>
          <Field.Root>
            <Field.Label>最大在庫数</Field.Label>
            <Input name="maximumStock" type="number" min="0" step="0.01" placeholder="0" />
          </Field.Root>
        </GridItem>
      </Grid>

      <Field.Root>
        <Field.Label>賞味期限</Field.Label>
        <Input name="expiryDate" type="date" />
      </Field.Root>

      <Field.Root>
        <Field.Label>バーコード</Field.Label>
        <Input name="barcode" placeholder="JANコードなど" />
      </Field.Root>
    </>
  )
}
