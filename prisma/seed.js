import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	// 既存データを削除
	await prisma.inventory.deleteMany();
	await prisma.item.deleteMany();
	await prisma.location.deleteMany();
	await prisma.category.deleteMany();

	// カテゴリを登録
	const categories = ['洗面用品', '日用品', '化粧品', '食料品'];
	const createdCategories = {};

	for (const name of categories) {
		const category = await prisma.category.create({
			data: { name }
		});
		createdCategories[name] = category;
	}

	// ロケーションを登録
	const locations = [
		'廊下',
		'玄関',
		'トイレ',
		'キッチン',
		'冷蔵庫',
		'リビング',
		'クローゼット',
		'脱衣所',
		'浴槽'
	];
	const createdLocations = {};

	for (const name of locations) {
		const location = await prisma.location.create({
			data: { name }
		});
		createdLocations[name] = location;
	}

	// アイテムを登録
	const items = [
		// 洗面用品
		{ name: 'シャンプー', categoryId: createdCategories['洗面用品'].id, barcode: '4901301234567' },
		{
			name: 'コンディショナー',
			categoryId: createdCategories['洗面用品'].id,
			barcode: '4901301234574'
		},
		{ name: '歯ブラシ', categoryId: createdCategories['洗面用品'].id, barcode: '4901301234581' },
		{
			name: 'ボディソープ',
			categoryId: createdCategories['洗面用品'].id,
			barcode: '4901301234598'
		},

		// 日用品
		{
			name: 'トイレットペーパー',
			categoryId: createdCategories['日用品'].id,
			barcode: '4901301234605'
		},
		{ name: '掃除用洗剤', categoryId: createdCategories['日用品'].id, barcode: '4901301234612' },
		{ name: 'タオル', categoryId: createdCategories['日用品'].id, barcode: '4901301234629' },
		{ name: '電池', categoryId: createdCategories['日用品'].id, barcode: '4901301234636' },

		// 化粧品
		{ name: '化粧水', categoryId: createdCategories['化粧品'].id, barcode: '4901301234643' },
		{ name: '乳液', categoryId: createdCategories['化粧品'].id, barcode: '4901301234650' },

		// 食料品
		{ name: '米', categoryId: createdCategories['食料品'].id, barcode: '4901301234667' },
		{ name: '調味料', categoryId: createdCategories['食料品'].id, barcode: '4901301234674' },
		{ name: '冷凍食品', categoryId: createdCategories['食料品'].id, barcode: '4901301234681' },
		{ name: 'パン', categoryId: createdCategories['食料品'].id, barcode: '4901301234698' }
	];

	const createdItems = {};
	for (const item of items) {
		const createdItem = await prisma.item.create({
			data: item
		});
		createdItems[item.name] = createdItem;
	}

	// 各ロケーションに在庫を配置
	const inventoryData = [
		// 廊下
		{ itemId: createdItems['掃除用洗剤'].id, locationId: createdLocations['廊下'].id, quantity: 2 },
		{ itemId: createdItems['電池'].id, locationId: createdLocations['廊下'].id, quantity: 5 },

		// 玄関
		{ itemId: createdItems['タオル'].id, locationId: createdLocations['玄関'].id, quantity: 3 },
		{ itemId: createdItems['掃除用洗剤'].id, locationId: createdLocations['玄関'].id, quantity: 1 },

		// トイレ
		{
			itemId: createdItems['トイレットペーパー'].id,
			locationId: createdLocations['トイレ'].id,
			quantity: 8
		},
		{
			itemId: createdItems['掃除用洗剤'].id,
			locationId: createdLocations['トイレ'].id,
			quantity: 1
		},

		// キッチン
		{ itemId: createdItems['米'].id, locationId: createdLocations['キッチン'].id, quantity: 1 },
		{ itemId: createdItems['調味料'].id, locationId: createdLocations['キッチン'].id, quantity: 4 },
		{ itemId: createdItems['パン'].id, locationId: createdLocations['キッチン'].id, quantity: 2 },

		// 冷蔵庫
		{ itemId: createdItems['冷凍食品'].id, locationId: createdLocations['冷蔵庫'].id, quantity: 6 },
		{ itemId: createdItems['パン'].id, locationId: createdLocations['冷蔵庫'].id, quantity: 1 },

		// リビング
		{ itemId: createdItems['電池'].id, locationId: createdLocations['リビング'].id, quantity: 3 },
		{ itemId: createdItems['タオル'].id, locationId: createdLocations['リビング'].id, quantity: 2 },

		// クローゼット
		{
			itemId: createdItems['タオル'].id,
			locationId: createdLocations['クローゼット'].id,
			quantity: 10
		},
		{
			itemId: createdItems['トイレットペーパー'].id,
			locationId: createdLocations['クローゼット'].id,
			quantity: 12
		},

		// 脱衣所
		{
			itemId: createdItems['シャンプー'].id,
			locationId: createdLocations['脱衣所'].id,
			quantity: 2
		},
		{
			itemId: createdItems['コンディショナー'].id,
			locationId: createdLocations['脱衣所'].id,
			quantity: 2
		},
		{
			itemId: createdItems['ボディソープ'].id,
			locationId: createdLocations['脱衣所'].id,
			quantity: 1
		},
		{ itemId: createdItems['化粧水'].id, locationId: createdLocations['脱衣所'].id, quantity: 1 },
		{ itemId: createdItems['乳液'].id, locationId: createdLocations['脱衣所'].id, quantity: 1 },

		// 浴槽
		{ itemId: createdItems['シャンプー'].id, locationId: createdLocations['浴槽'].id, quantity: 1 },
		{
			itemId: createdItems['コンディショナー'].id,
			locationId: createdLocations['浴槽'].id,
			quantity: 1
		},
		{
			itemId: createdItems['ボディソープ'].id,
			locationId: createdLocations['浴槽'].id,
			quantity: 1
		},
		{ itemId: createdItems['歯ブラシ'].id, locationId: createdLocations['浴槽'].id, quantity: 4 }
	];

	for (const inventory of inventoryData) {
		await prisma.inventory.create({
			data: inventory
		});
	}
}

main()
	.then(() => console.log('サンプルデータを登録しました！🎉'))
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
