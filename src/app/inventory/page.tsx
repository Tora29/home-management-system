import { InventoryList } from '@/features/inventory/ui/InventoryList'
import { prisma } from '@/shared/lib/prisma'

/**
 * 在庫一覧ページ
 */
export default async function InventoryPage(): Promise<JSX.Element> {
  const items = await prisma.item.findMany({
    where: {
      isActive: true,
      deletedAt: null,
    },
    include: {
      category: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  return <InventoryList items={items} />
}