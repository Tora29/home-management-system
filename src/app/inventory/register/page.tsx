import { getMasterData } from '@/features/inventory-registration/api/queries'
import { InventoryRegisterPageContent } from '@/features/inventory-registration/ui/InventoryRegisterPageContent'

/**
 * 在庫アイテム登録ページ
 */
export default async function InventoryRegisterPage(): Promise<React.ReactElement> {
  // マスターデータを取得
  const { categories, units, locations } = await getMasterData()

  return (
    <InventoryRegisterPageContent categories={categories} units={units} locations={locations} />
  )
}
