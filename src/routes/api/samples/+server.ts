import { prisma } from '$shared';

export async function GET() {
	const samples = await prisma.sample.findMany();
	return new Response(JSON.stringify(samples), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
}
