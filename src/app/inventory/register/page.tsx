'use server'

import { getMasterData } from '@/features/inventory/api/queries'
import { Register } from '@/features/inventory/ui/Register'

/**
 * 在庫アイテム登録ページ
 */
export default async function InventoryRegisterPage(): Promise<React.ReactElement> {
  // マスターデータを取得
  const { categories, units, locations } = await getMasterData()

  return <Register categories={categories} units={units} locations={locations} />
}
