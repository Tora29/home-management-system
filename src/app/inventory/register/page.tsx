import { getCategories, getUnits, getLocations } from '@/features/inventory/api/actions'
import { ItemRegistrationForm } from '@/features/inventory/ui/ItemRegistrationForm'

/**
 * 在庫アイテム登録ページ
 */
export default async function ItemRegisterPage(): Promise<JSX.Element> {
  const [categories, units, locations] = await Promise.all([
    getCategories(),
    getUnits(),
    getLocations(),
  ])

  return (
    <ItemRegistrationForm
      categories={categories}
      units={units}
      locations={locations}
    />
  )
}