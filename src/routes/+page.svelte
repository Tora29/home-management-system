<script lang="ts">
	import { fetchSamples as fetchSamplesFromApi } from '$shared/api/fetchSamples';
	import type { PageData } from './$types';

	const { data } = $props<{ data: PageData }>();

	let samples = $state(data.samples);

	async function refreshSamples() {
		samples = await fetchSamplesFromApi(window.fetch);
	}
</script>

<div class="col-start-2">
	<button onclick={refreshSamples}>更新</button>

	<h1>Samples</h1>
	<ul>
		{#each samples as sample}
			<li>{sample.name}</li>
			<li>{sample.updatedAt}</li>
		{/each}
	</ul>
</div>
