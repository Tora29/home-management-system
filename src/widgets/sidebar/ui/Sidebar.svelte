<script lang="ts">
	import Home from '$shared/icons/Home.svelte';
	import Users from '$shared/icons/Users.svelte';
	import Settings from '$shared/icons/Settings.svelte';
	import BarChart from '$shared/icons/BarChart.svelte';
	import FileText from '$shared/icons/FileText.svelte';
	import { page } from '$app/state';
	import type { MenuItem } from '../model/types';

	/**
	 * サイドバーのメニューアイテム配列
	 */
	const menuItems: MenuItem[] = [
		{
			id: 'dashboard',
			title: 'ダッシュボード',
			href: '/',
			icon: Home
		},
		{
			id: 'users',
			title: 'ユーザー管理',
			href: '/users',
			icon: Users
		},
		{
			id: 'inventory',
			title: '在庫管理',
			href: '/inventory',
			icon: BarChart
		},
		{
			id: 'reports',
			title: 'レポート',
			href: '/reports',
			icon: FileText
		},
		{
			id: 'settings',
			title: '設定',
			href: '/settings',
			icon: Settings
		}
	];

	/**
	 * 現在のページがアクティブかどうかを判定
	 * @param href メニューアイテムのhref
	 * @returns アクティブかどうか
	 */
	const isActive = (href: string): boolean => {
		if (href === '/') {
			return page.url.pathname === '/';
		}
		return page.url.pathname.startsWith(href);
	};
</script>

<aside class="w-64 bg-gray-900 text-white h-screen sticky top-0">
	<div class="p-6">
		<h1 class="text-xl font-bold text-white">ホーム管理システム</h1>
	</div>

	<nav class="mt-8">
		<ul class="space-y-2 px-4">
			{#each menuItems as item (item.id)}
				{@const IconComponent = item.icon}
				<li>
					<a
						href={item.href}
						class="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200 {isActive(
							item.href
						)
							? 'bg-gray-800 text-white'
							: ''}"
					>
						<IconComponent class="w-5 h-5 mr-3" />
						<span class="font-medium">{item.title}</span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</aside>
