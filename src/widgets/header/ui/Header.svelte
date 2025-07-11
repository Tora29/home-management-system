<script lang="ts">
	import { Menu, X } from '$shared/icons';

	let isMenuOpen = $state(false);

	/**
	 * モバイルメニューの表示状態を切り替える
	 */
	const toggleMobileMenu = () => {
		isMenuOpen = !isMenuOpen;
	};
</script>

<header class="bg-white shadow-sm border-b">
	<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
		<div class="flex justify-between items-center h-16">
			<!-- ロゴ -->
			<div class="flex-shrink-0">
				<a href="/" class="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
					HomeMS
				</a>
			</div>

			<!-- デスクトップナビゲーション -->
			<nav class="hidden md:flex space-x-8">
				<a
					href="/"
					class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
				>
					ホーム
				</a>
				<a
					href="/users"
					class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
				>
					ユーザー
				</a>
				<a
					href="/settings"
					class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
				>
					設定
				</a>
			</nav>

			<!-- モバイルメニューボタン -->
			<button
				class="md:hidden p-2 text-gray-700 hover:text-blue-600 rounded-md transition-colors"
				onclick={toggleMobileMenu}
				aria-label="メニューを開く"
			>
				{#if isMenuOpen}
					<X class="h-6 w-6" />
				{:else}
					<Menu class="h-6 w-6" />
				{/if}
			</button>
		</div>
	</div>

	<!-- モバイルメニュー -->
	{#if isMenuOpen}
		<div class="md:hidden bg-white border-t">
			<div class="px-2 pt-2 pb-3 space-y-1">
				<a
					href="/"
					class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
				>
					ホーム
				</a>
				<a
					href="/users"
					class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
				>
					ユーザー
				</a>
				<a
					href="/settings"
					class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
				>
					設定
				</a>
			</div>
		</div>
	{/if}
</header>
