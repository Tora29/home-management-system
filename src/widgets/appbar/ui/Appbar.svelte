<script lang="ts">
	import { AppBar } from '@skeletonlabs/skeleton-svelte';

	// Icons
	import Paperclip from '@lucide/svelte/icons/paperclip';
	import Calendar from '@lucide/svelte/icons/calendar';
	import CircleUser from '@lucide/svelte/icons/circle-user';
</script>

<AppBar>
	{#snippet lead()}
		<h1 class="h1">HMS</h1>
	{/snippet}
	{#snippet trail()}
		<Paperclip size={20} />
		<Calendar size={20} />
		<CircleUser size={20} />
	{/snippet}
</AppBar>
