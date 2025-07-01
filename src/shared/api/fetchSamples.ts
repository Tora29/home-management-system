import { apiLoad } from '$shared/utils/api/fetch';

export const fetchSamples = async (fetchFn: typeof fetch) =>
	await apiLoad<{ id: number; name: string; updatedAt: string }>('/api/samples', fetchFn);
