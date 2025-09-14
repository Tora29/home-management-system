'use client'

import { useState, useTransition } from 'react'

import { useRouter } from 'next/navigation'

import {
  Input,
  Textarea,
  Container,
  Heading,
  Card,
  Grid,
  GridItem,
  Stack,
  NativeSelectField,
  NativeSelectRoot,
} from '@chakra-ui/react'

import { Field } from '@/shared/components/ui/field'
import { FormActions } from '@/shared/components/ui/form-actions'
import { toaster } from '@/shared/components/ui/toaster'

import { createItem } from '../api/actions'

import type { Category, Unit, Location } from '@prisma/client'



interface ItemRegistrationFormProps {
  categories: Category[]
  units: Unit[]
  locations: Location[]
}

/**
 * 在庫アイテム登録フォーム
 */
export function ItemRegistrationForm({ categories, units, locations }: ItemRegistrationFormProps): React.ReactElement {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [customLocation, setCustomLocation] = useState(false)

  const validateForm = (formData: FormData): Record<string, string> => {
    const newErrors: Record<string, string> = {}

    const name = formData.get('name') as string
    if (!name) {
      newErrors.name = 'アイテム名は必須です'
    }
    else if (name.length > 100) {
      newErrors.name = 'アイテム名は100文字以内で入力してください'
    }

    const quantity = formData.get('quantity') as string
    if (!quantity) {
      newErrors.quantity = '数量は必須です'
    }
    else if (Number(quantity) < 0) {
      newErrors.quantity = '数量は0以上で入力してください'
    }

    const unit = formData.get('unit') as string
    if (!unit) {
      newErrors.unit = '単位は必須です'
    }

    const categoryId = formData.get('categoryId') as string
    if (!categoryId) {
      newErrors.categoryId = 'カテゴリは必須です'
    }

    const location = formData.get('location') as string
    const customLocationValue = formData.get('customLocation') as string
    const finalLocation = location === 'その他' ? customLocationValue : location

    if (finalLocation && finalLocation.length > 50) {
      newErrors.location = '保管場所は50文字以内で入力してください'
    }

    const notes = formData.get('notes') as string
    if (notes && notes.length > 500) {
      newErrors.notes = '備考は500文字以内で入力してください'
    }

    return newErrors
  }

  const handleSubmit = async (formData: FormData): Promise<void> => {
    // 保管場所の処理
    const locationId = formData.get('location') as string
    const customLocationValue = formData.get('customLocation') as string

    // 「その他」が選択された場合、カスタム入力値を使用
    const selectedLocation = locations.find(l => l.id === locationId)
    if (selectedLocation?.name === 'other' && customLocationValue) {
      formData.set('location', customLocationValue)
    } else if (selectedLocation) {
      formData.set('location', selectedLocation.displayName)
    }
    formData.delete('customLocation')

    // 単位のdisplayNameを設定
    const unitId = formData.get('unit') as string
    const selectedUnit = units.find(u => u.id === unitId)
    if (selectedUnit) {
      formData.set('unit', selectedUnit.displayName)
    }

    const newErrors = validateForm(formData)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})

    startTransition(async () => {
      try {
        await createItem(formData)
        toaster.create({
          title: '登録完了',
          description: 'アイテムを登録しました',
          type: 'success',
          duration: 3000,
        })
      } catch (error) {
        toaster.create({
          title: '登録エラー',
          description: error instanceof Error ? error.message : '登録に失敗しました',
          type: 'error',
          duration: 5000,
        })
      }
    })
  }

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    const selectedLocation = locations.find(l => l.id === e.target.value)
    setCustomLocation(selectedLocation?.name === 'other')
  }

  return (
    <Container maxW="container.md" py={8}>
      <Stack gap={8} align="stretch">
        <Heading size="lg" textAlign="center">
          在庫アイテム登録
        </Heading>

        <Card.Root>
          <Card.Body>
            <form action={handleSubmit}>
              <Stack gap={6} align="stretch">
                <Field label="アイテム名" required invalid={!!errors.name} errorText={errors.name}>
                  <Input
                    name="name"
                    placeholder="例: トイレットペーパー"
                    maxLength={100}
                  />
                </Field>

                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <GridItem>
                    <Field label="数量" required invalid={!!errors.quantity} errorText={errors.quantity}>
                      <Input
                        type="number"
                        name="quantity"
                        placeholder="0"
                        min={0}
                        step={0.1}
                      />
                    </Field>
                  </GridItem>

                  <GridItem>
                    <Field label="単位" required invalid={!!errors.unit} errorText={errors.unit}>
                      <NativeSelectRoot>
                        <NativeSelectField name="unit" placeholder="選択してください">
                          {units.map((unit) => (
                            <option key={unit.id} value={unit.id}>
                              {unit.displayName}
                            </option>
                          ))}
                        </NativeSelectField>
                      </NativeSelectRoot>
                    </Field>
                  </GridItem>
                </Grid>

                <Field label="カテゴリ" required invalid={!!errors.categoryId} errorText={errors.categoryId}>
                  <NativeSelectRoot>
                    <NativeSelectField name="categoryId" placeholder="選択してください">
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.icon && `${category.icon} `}{category.name}
                        </option>
                      ))}
                    </NativeSelectField>
                  </NativeSelectRoot>
                </Field>

                <Field label="保管場所" invalid={!!errors.location} errorText={errors.location}>
                  <Stack gap={2}>
                    <NativeSelectRoot>
                      <NativeSelectField
                        name="location"
                        placeholder="選択してください"
                        onChange={handleLocationChange}
                      >
                        {locations.map((location) => (
                          <option key={location.id} value={location.id}>
                            {location.displayName}
                          </option>
                        ))}
                      </NativeSelectField>
                    </NativeSelectRoot>
                    {customLocation && (
                      <Input
                        name="customLocation"
                        placeholder="保管場所を入力してください"
                        maxLength={50}
                      />
                    )}
                  </Stack>
                </Field>

                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                  <GridItem>
                    <Field label="賞味期限・消費期限">
                      <Input
                        type="date"
                        name="expiryDate"
                      />
                    </Field>
                  </GridItem>

                  <GridItem>
                    <Field label="最小在庫数（アラート設定用）">
                      <Input
                        type="number"
                        name="minimumStock"
                        placeholder="例: 2"
                        min={0}
                        step={0.1}
                      />
                    </Field>
                  </GridItem>
                </Grid>

                <Field label="備考" invalid={!!errors.notes} errorText={errors.notes}>
                  <Textarea
                    name="notes"
                    placeholder="メモやコメントを入力"
                    maxLength={500}
                    rows={3}
                  />
                </Field>

                <FormActions
                  primaryLabel="登録する"
                  primaryLoadingText="登録中..."
                  secondaryLabel="キャンセル"
                  isLoading={isPending}
                  onSecondaryClick={() => router.push('/inventory')}
                />
              </Stack>
            </form>
          </Card.Body>
        </Card.Root>
      </Stack>
    </Container>
  )
}