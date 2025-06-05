import { apiLoad } from '$shared/utils/api/fetch';
import type {
	InventoryItem,
	InventoryItemWithRelations
} from '$features/inventoryList/model/InventoryListModel';

/**
 * 在庫一覧をAPIから取得する
 * 共通関数fetchInventoriesを型付きで呼び出す
 *
 * @param {typeof fetch} fetchFn - fetch関数
 * @returns {Promise<InventoryItem[]>} フロントエンド用の在庫一覧
 */
export const fetchInventories = async (fetchFn: typeof fetch): Promise<InventoryItem[]> => {
	return await apiLoad<InventoryItem>('/api/inventories', fetchFn);
};

/**
 * 在庫一覧をAPIから取得する
 * 共通関数fetchInventoryWithRelationsを型付きで呼び出す
 *
 * @param {typeof fetch} fetchFn - fetch関数
 * @returns {Promise<InventoryItemWithRelations[]>} フロントエンド用の在庫一覧
 */
export const fetchInventoryWithRelations = async (fetchFn: typeof fetch) => {
	return await apiLoad<InventoryItemWithRelations>('/api/inventories', fetchFn);
};
