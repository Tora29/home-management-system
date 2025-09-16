import { prisma } from '@/shared/lib/prisma'

import type { Category, Unit, Location } from '@/entities/inventory/model'

/**
 * マスターデータ（カテゴリ、単位、保管場所）を一括取得する
 */
export async function getMasterData(): Promise<{
  categories: Category[]
  units: Unit[]
  locations: Location[]
}> {
  const [categories, units, locations] = await Promise.all([
    prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.unit.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.location.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ])

  return { categories, units, locations }
}
