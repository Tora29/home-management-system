<script lang="ts">
	import Users from '@lucide/svelte/icons/users';
	let { class: className = '' } = $props();
</script>

<Users class={className} />
