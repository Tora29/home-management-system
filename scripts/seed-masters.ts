import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 単位マスタの初期データ
  const units = [
    { name: 'piece', displayName: '個', sortOrder: 1 },
    { name: 'bottle', displayName: '本', sortOrder: 2 },
    { name: 'bag', displayName: '袋', sortOrder: 3 },
    { name: 'box', displayName: '箱', sortOrder: 4 },
    { name: 'pack', displayName: 'パック', sortOrder: 5 },
    { name: 'kg', displayName: 'kg', sortOrder: 6 },
    { name: 'g', displayName: 'g', sortOrder: 7 },
    { name: 'l', displayName: 'L', sortOrder: 8 },
    { name: 'ml', displayName: 'ml', sortOrder: 9 },
    { name: 'sheet', displayName: '枚', sortOrder: 10 },
    { name: 'can', displayName: '缶', sortOrder: 11 },
    { name: 'set', displayName: 'セット', sortOrder: 12 },
    { name: 'roll', displayName: 'ロール', sortOrder: 13 },
    { name: 'bundle', displayName: '束', sortOrder: 14 },
    { name: 'dozen', displayName: 'ダース', sortOrder: 15 },
  ]

  // 保管場所マスタの初期データ
  const locations = [
    { name: 'kitchen', displayName: 'キッチン', description: '調理場', sortOrder: 1 },
    {
      name: 'kitchen_shelf',
      displayName: 'キッチン棚',
      description: 'キッチンの収納棚',
      sortOrder: 2,
    },
    { name: 'refrigerator', displayName: '冷蔵庫', description: '冷蔵保存', sortOrder: 3 },
    { name: 'freezer', displayName: '冷凍庫', description: '冷凍保存', sortOrder: 4 },
    { name: 'pantry', displayName: 'パントリー', description: '食品庫', sortOrder: 5 },
    { name: 'living', displayName: 'リビング', description: '居間', sortOrder: 6 },
    { name: 'washroom', displayName: '洗面所', description: '洗面所・脱衣所', sortOrder: 7 },
    { name: 'bathroom', displayName: 'バスルーム', description: '浴室', sortOrder: 8 },
    { name: 'toilet', displayName: 'トイレ', description: 'トイレ', sortOrder: 9 },
    { name: 'bedroom', displayName: '寝室', description: '寝室', sortOrder: 10 },
    { name: 'kids_room', displayName: '子供部屋', description: '子供部屋', sortOrder: 11 },
    { name: 'study', displayName: '書斎', description: '書斎・仕事部屋', sortOrder: 12 },
    { name: 'entrance', displayName: '玄関', description: '玄関', sortOrder: 13 },
    {
      name: 'hallway_storage',
      displayName: '廊下収納',
      description: '廊下の収納スペース',
      sortOrder: 14,
    },
    { name: 'closet', displayName: 'クローゼット', description: 'クローゼット', sortOrder: 15 },
    { name: 'oshiire', displayName: '押入れ', description: '押入れ', sortOrder: 16 },
    { name: 'storage', displayName: '物置', description: '物置・倉庫', sortOrder: 17 },
    { name: 'garage', displayName: 'ガレージ', description: '車庫', sortOrder: 18 },
    {
      name: 'balcony',
      displayName: 'ベランダ',
      description: 'ベランダ・バルコニー',
      sortOrder: 19,
    },
    { name: 'other', displayName: 'その他', description: 'その他の場所', sortOrder: 99 },
  ]

  // 単位マスタのデータ投入
  for (const unit of units) {
    const existing = await prisma.unit.findUnique({
      where: { name: unit.name },
    })

    if (!existing) {
      await prisma.unit.create({
        data: unit,
      })
      console.log(`単位「${unit.displayName}」を作成しました`)
    } else {
      console.log(`単位「${unit.displayName}」は既に存在します`)
    }
  }

  // 保管場所マスタのデータ投入
  for (const location of locations) {
    const existing = await prisma.location.findUnique({
      where: { name: location.name },
    })

    if (!existing) {
      await prisma.location.create({
        data: location,
      })
      console.log(`保管場所「${location.displayName}」を作成しました`)
    } else {
      console.log(`保管場所「${location.displayName}」は既に存在します`)
    }
  }

  console.log('マスタデータの初期化が完了しました')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
