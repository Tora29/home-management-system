<script lang="ts">
	import Home from '@lucide/svelte/icons/home';
	let { class: className = '' } = $props();
</script>

<Home class={className} />
