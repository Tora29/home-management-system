/**
 * トップページのデータロードモジュール
 * @module +page
 */

import type { PageLoad } from './$types';
import { fetchCategories } from '$shared/api/fetchCategories';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const categories = await fetchCategories(fetch);
		console.log('✅ categories:', categories);
		return { categories };
	} catch (error) {
		console.error('SSRでカテゴリ取得エラー:', error); // ✅ログが見えるように
		throw error; 
	}
};
