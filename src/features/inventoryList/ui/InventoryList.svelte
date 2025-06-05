<script lang="ts">
	import DataTable from '$shared/components/DataTable.svelte';
	import type { InventoryItemWithRelations } from '$features/inventoryList/model/InventoryListModel';

	// propsでinventoriesデータを受け取る
	const { inventories = [] }: { inventories?: InventoryItemWithRelations[] } = $props();

	// DataTable用の列定義
	const columns = [
		{
			key: 'item.name',
			label: '商品名',
			sortable: true,
			align: 'left' as const,
			formatter: (value: unknown) => (typeof value === 'string' ? value : '未設定'),
			width: '30%'
		},
		{
			key: 'location.name',
			label: '保管場所',
			sortable: true,
			align: 'left' as const,
			formatter: (value: unknown) => (typeof value === 'string' ? value : '未設定'),
			width: '10%'
		},
		{
			key: 'quantity',
			label: '数量',
			sortable: true,
			align: 'left' as const,
			formatter: (value: unknown) =>
				typeof value === 'number' ? `${value.toLocaleString()} 個` : '0 個',
			width: '10%'
		},
		{
			key: 'item.category.name',
			label: 'カテゴリ',
			sortable: true,
			align: 'left' as const,
			formatter: (value: unknown) => (typeof value === 'string' ? value : '未分類'),
			width: '10%'
		},
		{
			key: 'created_at',
			label: '入荷日時',
			sortable: true,
			formatter: (value: unknown) =>
				typeof value === 'string'
					? new Date(value).toLocaleDateString('ja-JP', {
							year: 'numeric',
							month: '2-digit',
							day: '2-digit',
							hour: '2-digit',
							minute: '2-digit'
						})
					: '不明',
			width: '20%'
		}
	];
</script>

<div>
	<DataTable data={inventories} {columns} />
</div>
