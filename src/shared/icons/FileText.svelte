<script lang="ts">
	import FileText from '@lucide/svelte/icons/file-text';
	let { class: className = '' } = $props();
</script>

<FileText class={className} />
