<script lang="ts">
	import { generateSvgFromJson } from '$shared/utils/jsonToSvg';
	import floorPlan from '$shared/static/floorPlan.json';
	import { onMount } from 'svelte';

	let svgElement: SVGSVGElement;

	function handleRoomClick(id: string, name: string) {
		console.log('Clicked:', id, name);
	}

	onMount(() => {
		svgElement = generateSvgFromJson(floorPlan, handleRoomClick);
		document.getElementById('svg-container')?.appendChild(svgElement);
	});
</script>

<div id="svg-container"></div>
