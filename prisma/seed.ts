import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 単位データの作成
  const units = [
    { name: 'piece', displayName: '個', sortOrder: 1 },
    { name: 'pack', displayName: 'パック', sortOrder: 2 },
    { name: 'box', displayName: '箱', sortOrder: 3 },
    { name: 'bottle', displayName: '本', sortOrder: 4 },
    { name: 'bag', displayName: '袋', sortOrder: 5 },
    { name: 'roll', displayName: 'ロール', sortOrder: 6 },
    { name: 'sheet', displayName: '枚', sortOrder: 7 },
    { name: 'set', displayName: 'セット', sortOrder: 8 },
    { name: 'kg', displayName: 'kg', sortOrder: 9 },
    { name: 'g', displayName: 'g', sortOrder: 10 },
    { name: 'l', displayName: 'L', sortOrder: 11 },
    { name: 'ml', displayName: 'ml', sortOrder: 12 },
  ]

  for (const unit of units) {
    await prisma.unit.upsert({
      where: { name: unit.name },
      update: unit,
      create: unit,
    })
  }
  console.log(`Created ${units.length} units`)

  // 保管場所データの作成
  const locations = [
    { name: 'pantry', displayName: 'パントリー', sortOrder: 1 },
    { name: 'refrigerator', displayName: '冷蔵庫', sortOrder: 2 },
    { name: 'freezer', displayName: '冷凍庫', sortOrder: 3 },
    { name: 'kitchen_cabinet', displayName: 'キッチン収納', sortOrder: 4 },
    { name: 'bathroom', displayName: '洗面所', sortOrder: 5 },
    { name: 'storage_room', displayName: '物置', sortOrder: 6 },
    { name: 'closet', displayName: 'クローゼット', sortOrder: 7 },
    { name: 'garage', displayName: '車庫', sortOrder: 8 },
    { name: 'other', displayName: 'その他', sortOrder: 99 },
  ]

  for (const location of locations) {
    await prisma.location.upsert({
      where: { name: location.name },
      update: location,
      create: location,
    })
  }
  console.log(`Created ${locations.length} locations`)

  // カテゴリデータの作成（既存のカテゴリーがない場合）
  const categories = [
    { name: '食品', icon: '🍕', sortOrder: 1 },
    { name: '飲料', icon: '🥤', sortOrder: 2 },
    { name: '調味料', icon: '🧂', sortOrder: 3 },
    { name: '日用品', icon: '🧻', sortOrder: 4 },
    { name: '洗剤・掃除用品', icon: '🧼', sortOrder: 5 },
    { name: '医薬品', icon: '💊', sortOrder: 6 },
    { name: '文具', icon: '✏️', sortOrder: 7 },
    { name: '電池・電球', icon: '🔋', sortOrder: 8 },
    { name: 'その他', icon: '📦', sortOrder: 99 },
  ]

  let categoryCount = 0
  for (const category of categories) {
    const exists = await prisma.category.findFirst({
      where: { name: category.name },
    })

    if (!exists) {
      await prisma.category.create({
        data: category,
      })
      categoryCount++
    }
  }
  console.log(`Created ${categoryCount} new categories`)

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
