<script lang="ts">
	import FloorPlan from '$features/floorViewer/ui/FloorViewer.svelte';
</script>

<div class="flex flex-col gap-6">
	<!-- 間取り図セクション -->
	<div class="border-surface-100-900 border-b p-4">
		<h2 class="h3 mb-4">
			間取り図
			<p class="text-sm font-normal">選択した部屋の在庫を表示します。</p>
		</h2>
		<div class="">
			<FloorPlan />
		</div>
	</div>
</div>
