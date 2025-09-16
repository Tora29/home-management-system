'use server'

import { getMasterData } from '@/features/inventory/api/queries'
import { InventoryRegister } from '@/features/inventory/ui/InventoryRegister'

/**
 * 在庫アイテム登録ページ
 */
export default async function InventoryRegisterPage(): Promise<React.ReactElement> {
  // マスターデータを取得
  const { categories, units, locations } = await getMasterData()

  return <InventoryRegister categories={categories} units={units} locations={locations} />
}
