import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	const sampleUsers = [
		{
			email: 'taro@example.com',
			name: '山田太郎'
		},
		{
			email: 'hanako@example.com',
			name: '佐藤花子'
		},
		{
			email: 'jiro@example.com',
			name: '田中次郎'
		}
	];

	for (const userData of sampleUsers) {
		await prisma.user.upsert({
			where: { email: userData.email },
			update: { name: userData.name },
			create: userData
		});
	}

	console.log('Sample users created successfully');
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
