/**
 * 在庫一覧のフロントエンド用型定義
 * @module InventoryListModel
 */

/**
 * 基本的な在庫情報の型
 */
export interface InventoryItem {
	id: number;
	itemId: number;
	locationId: number | null;
	quantity: number;
	created_at: string;
	updated_at: string;
}

/**
 * リレーション情報を含む在庫情報の型
 */
export interface InventoryItemWithRelations extends InventoryItem {
	item: {
		id: number;
		name: string | null;
		barcode: string | null;
		categoryId: number | null;
		min_threshold: number;
		category: {
			id: number;
			name: string;
		} | null;
	};
	location: {
		id: number;
		name: string;
	} | null;
}
