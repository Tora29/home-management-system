/**
 * トップページのデータロードモジュール
 * @module +page
 */

import type { PageLoad } from './$types';
import { getInventoryList } from '$features/inventoryList/api/InventoryListApi';

export const load: PageLoad = async ({ fetch }) => {
	const inventories = await getInventoryList(fetch);
	return { inventories };
};
