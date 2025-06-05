import { json } from '@sveltejs/kit';
import { prisma } from '$shared/utils/api/prisma';

export async function GET() {
	const categories = await prisma.category.findMany();
	return json(categories);
}
