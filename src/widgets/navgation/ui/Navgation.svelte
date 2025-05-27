<script lang="ts">
	import { Navigation } from '@skeletonlabs/skeleton-svelte';

	// Icons
	import Dashboard from '$shared/static/icon/DashBoard.svelte';
	import IconImage from '@lucide/svelte/icons/image';
	import IconMusic from '@lucide/svelte/icons/music';
	import IconVideo from '@lucide/svelte/icons/video';
</script>

<div class="card border-surface-100-900 grid h-screen w-full">
	<Navigation.Rail>
		{#snippet tiles()}
			<Navigation.Tile label="Dashboard" href="/"><Dashboard /></Navigation.Tile>
			<Navigation.Tile label="Images" href="#/images"><IconImage /></Navigation.Tile>
			<Navigation.Tile label="Music" href="#/music"><IconMusic /></Navigation.Tile>
			<Navigation.Tile label="Videos" href="#/videos"><IconVideo /></Navigation.Tile>
		{/snippet}
	</Navigation.Rail>
</div>
