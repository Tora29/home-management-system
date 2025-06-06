/**
 * 在庫一覧API呼出モジュール
 * @module inventoryListApi
 */
import { fetchInventoryWithRelations } from '$shared/api/fetchInventories';
import type { InventoryItemWithRelations } from '$features/inventoryList/model/InventoryListModel';

/**
 * 在庫一覧をAPIから取得する
 * 共通関数fetchInventoryListを型付きで呼び出す
 *
 * @param {typeof fetch} fetchFn - fetch関数
 * @returns {Promise<InventoryItemWithRelations[]>}
 */
export const getInventoryList = async (
	fetchFn: typeof fetch
): Promise<InventoryItemWithRelations[]> => {
	return await fetchInventoryWithRelations(fetchFn);
};
