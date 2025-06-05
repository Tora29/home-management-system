/**
 * トップページのデータロードモジュール
 * @module +page
 */

import type { PageLoad } from './$types';
import { fetchCategories } from '$shared/api/fetchCategories';

export const load: PageLoad = async ({ fetch }) => {
	const categories = await fetchCategories(fetch);
	return { categories };
};
