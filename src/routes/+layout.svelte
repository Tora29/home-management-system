<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="flex min-h-screen">
	<!-- 左メニュー -->
	<aside class="flex w-48 flex-shrink-0 items-center justify-center bg-gray-800 text-white">
		メニュー
	</aside>
	<!-- 12カラムグリッド -->
	<div class="grid grid-cols-12 gap-4">
		{@render children()}
	</div>
</div>
