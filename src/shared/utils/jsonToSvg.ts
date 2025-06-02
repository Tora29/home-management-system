import { ErrorMessages } from '$shared/utils/errorMessages';

/**
 * 色を暗くするユーティリティ関数
 * @param color 元の色（hex形式）
 * @param factor 暗くする度合い（0-1）
 * @returns 暗くした色
 */
function darkenColor(color: string, factor: number): string {
	// #を除去
	const hex = color.replace('#', '');

	// RGBに変換
	const r = parseInt(hex.slice(0, 2), 16);
	const g = parseInt(hex.slice(2, 4), 16);
	const b = parseInt(hex.slice(4, 6), 16);

	// 暗くする
	const newR = Math.round(r * (1 - factor));
	const newG = Math.round(g * (1 - factor));
	const newB = Math.round(b * (1 - factor));

	// hexに戻す
	return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

// 型定義
type Room = {
	id: string;
	name: string;
	type: string;
	coordinates?: string | undefined;
	x?: number | undefined;
	y?: number | undefined;
	width?: number | undefined;
	height?: number | undefined;
	style?:
		| {
				fill?: string;
		  }
		| undefined;
};

type FloorPlan = {
	width: number;
	height: number;
	viewBox: string;
	rooms: Room[];
};

/**
 * SVGファイルを読み込む
 * @param url SVGファイルのURL
 * @returns SVGコンテンツ（HTML文字列）
 */
export async function loadSvg(url: string): Promise<string> {
	try {
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Failed to load SVG: ${response.status} ${response.statusText}`);
		}
		return await response.text();
	} catch {
		throw new Error(ErrorMessages.SVG_GENERATION_ERROR);
	}
}

/**
 * JSONデータからSVGを生成する
 * @param floorPlan 間取り図データ
 * @param onClick 部屋クリック時のコールバック関数（id, nameを引数に渡す）
 * @returns SVG要素（HTMLElement）
 */
export function generateSvgFromJson(
	floorPlan: FloorPlan,
	onClick: (id: string, name: string) => void
): SVGSVGElement {
	const xmlns = 'http://www.w3.org/2000/svg';
	const svg = document.createElementNS(xmlns, 'svg');

	svg.setAttribute('width', String(floorPlan.width));
	svg.setAttribute('height', String(floorPlan.height));
	svg.setAttribute('viewBox', floorPlan.viewBox);

	for (const room of floorPlan.rooms) {
		const el = document.createElementNS(xmlns, room.type);

		// 共通属性
		el.setAttribute('id', room.id);
		el.setAttribute('fill', room.style?.fill ?? '#cccccc');
		el.style.cursor = 'pointer';
		el.style.transition = 'fill 0.2s ease-in-out';

		// ホバー効果
		const originalFill = room.style?.fill ?? '#cccccc';
		el.addEventListener('mouseenter', () => {
			// 色を20%暗くする
			const darkerColor = darkenColor(originalFill, 0.2);
			el.setAttribute('fill', darkerColor);
		});
		el.addEventListener('mouseleave', () => {
			el.setAttribute('fill', originalFill);
		});

		// 属性の割り当て
		if (room.type === 'path' && room.coordinates) {
			el.setAttribute('d', room.coordinates);
		} else if (room.type === 'rect') {
			if (room.x != null) el.setAttribute('x', String(room.x));
			if (room.y != null) el.setAttribute('y', String(room.y));
			if (room.width != null) el.setAttribute('width', String(room.width));
			if (room.height != null) el.setAttribute('height', String(room.height));
		}

		el.addEventListener('click', () => onClick(room.id, room.name));
		svg.appendChild(el);
	}

	return svg;
}
