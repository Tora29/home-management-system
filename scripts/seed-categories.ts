import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const categories = [
    { name: '食品', description: '食料品全般', icon: '🍽️', color: '#FF6B6B', sortOrder: 1 },
    {
      name: '日用品',
      description: '日常生活で使う消耗品',
      icon: '🏠',
      color: '#4ECDC4',
      sortOrder: 2,
    },
    {
      name: '掃除用品',
      description: '掃除に使う道具や洗剤',
      icon: '🧹',
      color: '#45B7D1',
      sortOrder: 3,
    },
    { name: '医薬品', description: '薬や医療用品', icon: '💊', color: '#F7B731', sortOrder: 4 },
    {
      name: '文房具',
      description: '筆記用具やオフィス用品',
      icon: '✏️',
      color: '#5F27CD',
      sortOrder: 5,
    },
    {
      name: 'キッチン用品',
      description: '調理器具や食器',
      icon: '🍳',
      color: '#00D2D3',
      sortOrder: 6,
    },
    {
      name: 'バス・トイレ用品',
      description: 'お風呂やトイレで使う用品',
      icon: '🚿',
      color: '#FF9FF3',
      sortOrder: 7,
    },
    { name: 'その他', description: 'その他の分類', icon: '📦', color: '#A0A0A0', sortOrder: 99 },
  ]

  for (const category of categories) {
    const existing = await prisma.category.findFirst({
      where: { name: category.name },
    })

    if (!existing) {
      await prisma.category.create({
        data: category,
      })
      console.log(`カテゴリ「${category.name}」を作成しました`)
    } else {
      console.log(`カテゴリ「${category.name}」は既に存在します`)
    }
  }

  console.log('カテゴリのシードデータを作成しました')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
