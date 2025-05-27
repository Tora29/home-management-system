<script lang="ts">
	import '../app.css';
	import Appbar from '$widgets/appbar/ui/Appbar.svelte';
	import Navgation from '$widgets/navgation/ui/Navgation.svelte';

	let { children } = $props();
</script>

<div class="flex h-screen flex-col">
	<div class="flex-shrink-0">
		<Appbar />
	</div>
	<div class="flex flex-grow flex-row">
		<div class="flex-shrink-0">
			<Navgation />
		</div>
		<div class="flex-grow">
			{@render children()}
		</div>
	</div>
</div>
