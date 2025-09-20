/**
 * Features層のクエリ - 複雑なデータ取得とマスタデータ
 */

import { getCategories, getUnits, getLocations } from '@/entities/inventory/api/queries'

import { searchParamsSchema } from '../model/search-validators'
import { searchInventoryItems } from '../service/search-item'

import type { SearchResponse } from '../model/search-validators'
import type { Category, Unit, Location } from '@/entities/inventory/model'

/**
 * マスターデータ（カテゴリ、単位、保管場所）を一括取得する
 * 複数エンティティをまたぐデータ取得のため、features層で管理
 * entities層の関数を組み合わせて使用
 */
export async function getMasterData(): Promise<{
  categories: Category[]
  units: Unit[]
  locations: Location[]
}> {
  const [categories, units, locations] = await Promise.all([
    getCategories(),
    getUnits(),
    getLocations(),
  ])

  return { categories, units, locations }
}

/**
 * 在庫アイテムを検索条件付きで取得
 */
export async function getInventoryItems(
  searchParams: Record<string, string | string[] | undefined>,
): Promise<SearchResponse> {
  const params = searchParamsSchema.parse({
    search: searchParams.search,
    categoryId: searchParams.category,
    locationId: searchParams.location,
    page: searchParams.page,
    limit: searchParams.limit,
  })

  return searchInventoryItems(params)
}
