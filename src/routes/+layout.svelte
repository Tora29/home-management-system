<script lang="ts">
	import { Header } from '$widgets/header';
	import { Sidebar } from '$widgets/sidebar';
	import '../app.css';

	let { children } = $props();
</script>

<div class="flex h-screen flex-col">
	<div class="flex-shrink-0">
		<Header />
	</div>
	<div class="flex min-h-0 flex-grow flex-row">
		<div class="flex-shrink-0">
			<Sidebar />
		</div>
		<div class="flex-grow overflow-auto">
			{@render children()}
		</div>
	</div>
</div>
