<script lang="ts">
	import DataTable from '$shared/components/DataTable.svelte';
	import SearchInput from '$shared/components/Input.svelte';
	import Select from '$shared/components/Select.svelte';
	import type { InventoryItemWithRelations } from '$features/inventoryList/model/InventoryListModel';

	// propsでinventoriesデータと選択された部屋、部屋リセット関数を受け取る
	const {
		inventories = [],
		selectedRoom = '',
		onResetRoomSelection
	}: {
		inventories?: InventoryItemWithRelations[];
		selectedRoom?: string;
		onResetRoomSelection?: () => void;
	} = $props();

	// フィルタリング用の状態
	let searchQuery = $state('');
	let selectedLocation = $state('');
	let selectedCategory = $state('');

	// 間取り図で選択した部屋と保管場所セレクトボックスを同期
	$effect(() => {
		if (selectedRoom) {
			// 間取り図で部屋が選択された場合、保管場所セレクトボックスも同期
			selectedLocation = selectedRoom;
		} else {
			// 部屋選択がリセットされた場合、保管場所セレクトボックスもリセット
			selectedLocation = '';
		}
	});

	// 保管場所のオプションを生成
	const locationOptions = $derived(() => {
		const uniqueLocations = [
			...new Set(inventories.map((item) => item.location?.name).filter(Boolean))
		];
		return uniqueLocations.map((location) => ({
			label: location as string,
			value: location as string
		}));
	});

	// カテゴリのオプションを生成
	const categoryOptions = $derived(() => {
		const uniqueCategories = [
			...new Set(inventories.map((item) => item.item?.category?.name).filter(Boolean))
		];
		return uniqueCategories.map((category) => ({
			label: category as string,
			value: category as string
		}));
	});

	// フィルタリングされたデータ
	const filteredInventories = $derived(() => {
		return inventories.filter((item) => {
			// 検索クエリでフィルタリング
			const matchesSearch =
				!searchQuery ||
				item.item?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.location?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
				item.item?.category?.name?.toLowerCase().includes(searchQuery.toLowerCase());

			// 保管場所でフィルタリング（間取り図選択と統合）
			const matchesLocation = !selectedLocation || item.location?.name === selectedLocation;

			// カテゴリでフィルタリング
			const matchesCategory = !selectedCategory || item.item?.category?.name === selectedCategory;

			return matchesSearch && matchesLocation && matchesCategory;
		});
	});

	// 検索ハンドラー
	function handleSearch(query: string) {
		searchQuery = query;
	}

	// 保管場所変更ハンドラー
	function handleLocationChange(location: string) {
		selectedLocation = location;
	}

	// カテゴリ変更ハンドラー
	function handleCategoryChange(category: string) {
		selectedCategory = category;
	}

	// フィルターリセットハンドラー（部屋選択リセットも含む）
	function handleResetFilters() {
		searchQuery = '';
		selectedLocation = '';
		selectedCategory = '';
		// 部屋選択もリセット
		if (onResetRoomSelection) {
			onResetRoomSelection();
		}
	}

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

<div class="space-y-6">
	<!-- 在庫検索セクション -->
	<section class="space-y-2">
		<div class="flex items-center justify-between">
			<h2 class="text-lg font-semibold">在庫検索</h2>
		</div>

		<!-- 検索とフィルターのコントロール -->
		<div class="flex gap-6">
			<!-- 検索インプット -->
			<div class="flex-grow">
				<SearchInput
					placeholder="検索"
					value={searchQuery}
					onChange={handleSearch}
					label="検索"
					title="商品名、保管場所、カテゴリで検索"
					className="h-9"
				/>
			</div>

			<!-- 保管場所フィルター -->
			<div class="flex-grow">
				<Select
					options={locationOptions()}
					value={selectedLocation}
					onChange={handleLocationChange}
					placeholder="保管場所を選択"
					label="保管場所"
					title="保管場所でフィルタリング"
					className="h-9"
				/>
			</div>

			<!-- カテゴリフィルター -->
			<div class="flex-grow">
				<Select
					options={categoryOptions()}
					value={selectedCategory}
					onChange={handleCategoryChange}
					placeholder="カテゴリを選択"
					label="カテゴリ"
					title="カテゴリでフィルタリング"
					className="h-9"
				/>
			</div>

			<!-- フィルターリセットボタン（部屋選択リセットも含む） -->
			<div class="flex flex-shrink-0 items-end">
				<button type="button" class="btn preset-ghost h-9" onclick={handleResetFilters}>
					すべてリセット
				</button>
			</div>
		</div>
	</section>

	<!-- データテーブル -->
	<section>
		<DataTable data={filteredInventories()} {columns} />
	</section>
</div>
