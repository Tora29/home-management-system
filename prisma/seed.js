import { PrismaClient } from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
	// 既存データを削除
	await prisma.category.deleteMany();

	// カテゴリを登録
	const categories = ['洗面用品', '日用品', '化粧品', '食料品'];

	for (const name of categories) {
		await prisma.category.create({
			data: { name }
		});
	}
}

main()
	.then(() => console.log('カテゴリを登録しました'))
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
