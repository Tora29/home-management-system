import { json } from '@sveltejs/kit';
import { PrismaClient } from '$prisma';

const prisma = new PrismaClient();

export async function GET() {
	const categories = await prisma.category.findMany();
	return json(categories);
}
