import { fetchSamples } from '$shared/api/fetchSamples';

export async function load(event) {
	const samples = await fetchSamples(event.fetch);
	return { samples };
}
