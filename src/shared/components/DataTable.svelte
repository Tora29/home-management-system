<script lang="ts">
	import { Pagination } from '@skeletonlabs/skeleton-svelte';

	// Icons
	import ArrowLeft from '$shared/static/icon/ArrowLeft.svelte';
	import ArrowRight from '$shared/static/icon/ArrowRight.svelte';
	import Ellipsis from '$shared/static/icon/Ellipsis.svelte';
	import ChevronsLeft from '$shared/static/icon/ChevronsLeft.svelte';
	import ChevronRight from '$shared/static/icon/ChevronRight.svelte';

	/**
	 * データテーブルコンポーネント
	 * @component DataTable
	 */

	/**
	 * テーブルの列定義
	 * @typedef {Object} TableColumn
	 * @property {string} key - データのキー
	 * @property {string} label - 表示ラベル
	 * @property {boolean} [sortable=false] - ソート可能かどうか
	 * @property {string} [align='left'] - テキストの配置（left/center/right）
	 * @property {Function} [formatter] - 値をフォーマットする関数
	 * @property {string} [width] - 列の幅
	 */
	interface TableColumn {
		key: string;
		label: string;
		sortable?: boolean;
		align?: 'left' | 'center' | 'right';
		formatter?: (value: unknown) => string;
		width?: string;
	}

	/**
	 * ページサイズオプション
	 * @typedef {Object} PageSizeOption
	 * @property {number} value - ページサイズの値
	 * @property {string} label - 表示ラベル
	 */
	interface PageSizeOption {
		value: number;
		label: string;
	}

	/**
	 * コンポーネントのプロパティ定義
	 * @typedef {Object} DataTableProps
	 * @property {Array<Record<string, unknown>>} [data=[]] - テーブルデータ
	 * @property {Array<TableColumn>} [columns=[]] - テーブル列の定義
	 * @property {Array<PageSizeOption>} [pageSizeOptions] - ページサイズオプション
	 * @property {number} [defaultPageSize=5] - デフォルトのページサイズ
	 * @property {number} [defaultPage=1] - デフォルトのページ番号
	 * @property {number} [siblingCount=1] - ページネーションで表示する隣接ページ数
	 * @property {boolean} [showPagination=true] - ページネーションを表示するか
	 * @property {boolean} [showPageSizeSelector=true] - ページサイズセレクターを表示するか
	 * @property {string} [className=''] - 追加のCSSクラス
	 * @property {Function} [onPageChange] - ページ変更時のコールバック
	 * @property {Function} [onPageSizeChange] - ページサイズ変更時のコールバック
	 */
	interface DataTableProps {
		data?: unknown[];
		columns?: TableColumn[];
		pageSizeOptions?: PageSizeOption[];
		defaultPageSize?: number;
		defaultPage?: number;
		siblingCount?: number;
		showPagination?: boolean;
		showPageSizeSelector?: boolean;
		className?: string;
		onPageChange?: (page: number) => void;
		onPageSizeChange?: (pageSize: number) => void;
	}

	// デフォルトのページサイズオプション
	const defaultPageSizeOptions: PageSizeOption[] = [
		{ value: 5, label: 'Items 5' },
		{ value: 10, label: 'Items 10' },
		{ value: 20, label: 'Items 20' },
		{ value: 50, label: 'Items 50' },
		{ value: 100, label: 'Items 100' }
	];

	/**
	 * コンポーネントの初期値
	 */
	const {
		data = [],
		columns = [],
		pageSizeOptions = defaultPageSizeOptions,
		defaultPageSize = 5,
		defaultPage = 1,
		siblingCount = 1,
		showPagination = true,
		showPageSizeSelector = true,
		className = '',
		onPageChange = undefined,
		onPageSizeChange = undefined
	}: DataTableProps = $props();

	// State
	let page = $state(defaultPage);
	let size = $state(defaultPageSize);

	// 表示データの計算
	const slicedSource = $derived(() => data.slice((page - 1) * size, page * size));

	// 全件表示オプションの追加
	const enhancedPageSizeOptions = $derived(() => [
		...pageSizeOptions,
		...(data.length > 0 ? [{ value: data.length, label: 'Show All' }] : [])
	]);

	/**
	 * ページサイズ変更ハンドラー
	 * @param {Event} event - 変更イベント
	 */
	function handlePageSizeChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const newSize = Number(target.value);
		size = newSize;
		page = 1; // ページサイズ変更時はページを1にリセット

		if (typeof onPageSizeChange === 'function') {
			onPageSizeChange(newSize);
		}
	}

	/**
	 * ページ変更ハンドラー
	 * @param {Object} e - ページ変更イベント
	 */
	function handlePageChange(e: { page: number }) {
		page = e.page;

		if (typeof onPageChange === 'function') {
			onPageChange(e.page);
		}
	}

	/**
	 * セルの値をフォーマット
	 * @param {unknown} value - 元の値
	 * @param {TableColumn} column - 列定義
	 * @returns {string} フォーマット済みの値
	 */
	function formatCellValue(value: unknown, column: TableColumn): string {
		if (column.formatter && typeof column.formatter === 'function') {
			return column.formatter(value);
		}
		return String(value ?? '');
	}

	/**
	 * ネストしたオブジェクトから値を取得する
	 * @param {unknown} obj - 対象オブジェクト
	 * @param {string} path - ドット記法のパス
	 * @returns {unknown} 取得した値
	 */
	function getNestedValue(obj: unknown, path: string): unknown {
		if (!obj || typeof obj !== 'object') {
			return undefined;
		}

		return path.split('.').reduce((current: unknown, key: string) => {
			if (current && typeof current === 'object' && key in current) {
				return (current as Record<string, unknown>)[key];
			}
			return undefined;
		}, obj);
	}

	/**
	 * テーブルのCSSクラスを取得
	 * @returns {string} 適用するCSSクラス名の文字列
	 */
	function getTableClasses(): string {
		return ['space-y-4', className].filter(Boolean).join(' ');
	}

	/**
	 * セルの配置クラスを取得
	 * @param {string} align - 配置指定
	 * @returns {string} 配置用のCSSクラス
	 */
	function getAlignClass(align: string = 'left'): string {
		const alignMap: Record<string, string> = {
			left: '',
			center: 'text-center',
			right: 'text-right'
		};
		return alignMap[align] || '';
	}
</script>

<section class={getTableClasses()}>
	<!-- Table -->
	<div class="table-wrap">
		<table class="table table-fixed caption-bottom">
			<thead>
				<tr>
					{#each columns as column (column.key)}
						<th
							class={getAlignClass(column.align)}
							style={column.width ? `width: ${column.width}` : ''}>{column.label}</th
						>
					{/each}
				</tr>
			</thead>
			<tbody class="[&>tr]:hover:preset-tonal-primary">
				{#each slicedSource() as row, index (index)}
					<tr>
						{#each columns as column (column.key)}
							<td
								class={getAlignClass(column.align)}
								style={column.width ? `width: ${column.width}` : ''}
							>
								{formatCellValue(getNestedValue(row, column.key), column)}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>

	{#if showPagination && data.length > 0}
		<!-- Footer -->
		<footer class="flex justify-between">
			{#if showPageSizeSelector}
				<select
					name="size"
					id="size"
					class="select max-w-[150px]"
					value={size}
					onchange={handlePageSizeChange}
				>
					{#each enhancedPageSizeOptions() as option (option.value)}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			{/if}

			<!-- Pagination -->
			<Pagination
				{data}
				{page}
				onPageChange={handlePageChange}
				pageSize={size}
				onPageSizeChange={(e) => (size = e.pageSize)}
				{siblingCount}
			>
				{#snippet labelEllipsis()}<Ellipsis />{/snippet}
				{#snippet labelNext()}<ArrowRight />{/snippet}
				{#snippet labelPrevious()}<ArrowLeft />{/snippet}
				{#snippet labelFirst()}<ChevronsLeft />{/snippet}
				{#snippet labelLast()}<ChevronRight />{/snippet}
			</Pagination>
		</footer>
	{/if}
</section>
