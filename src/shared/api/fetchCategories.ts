import { apiLoad } from '$shared/utils/api/fetch';

export const fetchCategories = async (fetchFn: typeof fetch) => {
	return await apiLoad('/api/categories', fetchFn);
};
