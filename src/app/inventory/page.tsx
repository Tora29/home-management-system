/**
 * 在庫管理ページ（RSC）
 */

import { getCategories, getLocations } from '@/entities/inventory/api/queries'
import { getInventoryItems } from '@/features/inventory/api/queries'
import { ManagementView } from '@/features/inventory/ui/ManagementView'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

/**
 * 在庫管理ページコンポーネント
 *
 * @returns 在庫管理画面
 */
export default async function InventoryPage({
  searchParams,
}: PageProps): Promise<React.ReactElement> {
  const params = await searchParams

  // 並列でデータ取得
  const [inventoryData, categories, locations] = await Promise.all([
    getInventoryItems(params),
    getCategories(),
    getLocations(),
  ])

  return (
    <ManagementView initialData={inventoryData} categories={categories} locations={locations} />
  )
}
