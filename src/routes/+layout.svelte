<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="flex h-screen flex-col">
	<!-- ヘッダー -->
	<div class="bg-dark-main h-16 flex-shrink-0">header</div>
	<div class="flex min-h-0 flex-grow flex-row">
		<!-- 左メニュー -->
		<div class="bg-dark-sub h-full w-48 flex-shrink-0">メニュー</div>
		<!-- メインコンテンツ -->
		<div class="bg-light-main grid flex-grow grid-cols-12 gap-4 overflow-auto">
			{@render children()}
		</div>
	</div>
</div>
