<script lang="ts">
	import { onMount } from 'svelte';
	import { apiGet } from '$shared/api/fetch';
	import { INFO_MESSAGES } from '$shared/constants/messages';
	import type { User } from '$shared/api/types';

	let users = $state<User[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);

	onMount(async () => {
		const response = await apiGet<User[]>('/api/users');

		if (response.success) {
			users = response.data || [];
		} else {
			error = response.error;
		}

		loading = false;
	});
</script>

<div class="max-w-4xl mx-auto">
	<h1 class="text-3xl font-bold text-gray-900 mb-8">ユーザー一覧</h1>

	{#if loading}
		<p class="text-gray-600">{INFO_MESSAGES.LOADING_DATA}</p>
	{:else if error}
		<p class="text-red-600 font-semibold">エラー: {error}</p>
	{:else if users.length === 0}
		<p class="text-gray-600">{INFO_MESSAGES.NO_USERS}</p>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each users as user (user.id)}
				<div
					class="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow"
				>
					<h3 class="text-xl font-semibold text-gray-900 mb-2">{user.name || 'Unknown'}</h3>
					<p class="text-gray-600 mb-3">{user.email}</p>
					<small class="text-gray-500"
						>作成日: {new Date(user.createdAt).toLocaleDateString('ja-JP')}</small
					>
				</div>
			{/each}
		</div>
	{/if}
</div>
