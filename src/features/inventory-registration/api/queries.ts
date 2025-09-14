import { prisma } from '@/shared/lib/prisma'

import type { Category, Unit, Location } from '@/entities/inventory/model'

/**
 * アクティブなカテゴリ一覧を取得する
 */
export async function getActiveCategories(): Promise<Category[]> {
  return await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })
}

/**
 * アクティブな単位一覧を取得する
 */
export async function getActiveUnits(): Promise<Unit[]> {
  return await prisma.unit.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })
}

/**
 * アクティブな保管場所一覧を取得する
 */
export async function getActiveLocations(): Promise<Location[]> {
  return await prisma.location.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })
}

/**
 * マスターデータ（カテゴリ、単位、保管場所）を一括取得する
 */
export async function getMasterData(): Promise<{
  categories: Category[]
  units: Unit[]
  locations: Location[]
}> {
  const [categories, units, locations] = await Promise.all([
    getActiveCategories(),
    getActiveUnits(),
    getActiveLocations(),
  ])

  return { categories, units, locations }
}
