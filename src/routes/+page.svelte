<script lang="ts">
	import FloorPlan from '$features/floorViewer/ui/FloorViewer.svelte';
	import InventoryList from '$features/inventoryList/ui/InventoryList.svelte';

	const { data } = $props();

	console.log(data);
</script>

<div class="flex flex-col gap-6">
	<!-- 間取り図セクション -->
	<div class="border-surface-100-900 border-b p-4">
		<h2 class="h3 mb-4">
			間取り図
			<p class="text-sm font-normal">選択した部屋の在庫を表示します。</p>
		</h2>
		<div class="flex justify-center">
			<FloorPlan />
		</div>
	</div>
	<div class="border-surface-100-900 border-b p-4">
		<h2 class="h3 mb-4">在庫一覧</h2>
		<div class="flex justify-center">
			<InventoryList inventories={data.inventories} />
		</div>
	</div>
</div>
