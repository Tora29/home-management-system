import { json } from '@sveltejs/kit';
import { prisma } from '$shared/utils/api/prisma';

export async function GET() {
	const inventories = await prisma.inventory.findMany({
		include: {
			item: {
				include: {
					category: true
				}
			},
			location: true
		}
	});
	return json(inventories);
}
