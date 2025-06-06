<script lang="ts">
	import { generateSvgFromJson } from '$shared/utils/jsonToSvg';
	import floorPlan from '$shared/static/floorPlan.json';
	import { onMount } from 'svelte';

	// propsで部屋選択時のコールバック関数を受け取る
	const { onRoomSelect }: { onRoomSelect?: (roomName: string) => void } = $props();

	let svgElement: SVGSVGElement;

	function handleRoomClick(name: string) {
		// 親コンポーネントに部屋選択を通知
		if (onRoomSelect) {
			onRoomSelect(name);
		}
	}

	onMount(() => {
		svgElement = generateSvgFromJson(floorPlan, handleRoomClick);
		document.getElementById('svg-container')?.appendChild(svgElement);
	});
</script>

<div id="svg-container"></div>
