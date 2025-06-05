<script lang="ts">
	/**
	 * 検索インプットコンポーネント
	 * @component SearchInput
	 */

	import Search from '$shared/static/icon/Search.svelte';

	/**
	 * コンポーネントのプロパティ定義
	 * @typedef {Object} SearchInputProps
	 * @property {string} [label] - ラベル
	 * @property {string} [id] - インプットのID
	 * @property {string} [placeholder='検索...'] - プレースホルダーテキスト
	 * @property {string} [title] - インプットのタイトル
	 * @property {string} [value=''] - 入力値
	 * @property {string} [type='search'] - インプットタイプ
	 * @property {Function} [onInput] - 入力時のコールバック関数
	 * @property {Function} [onChange] - 変更時のコールバック関数
	 * @property {Function} [onSearch] - 検索実行時のコールバック関数
	 * @property {boolean} [disabled=false] - 無効状態の指定
	 * @property {boolean} [required=false] - 必須項目の指定
	 * @property {boolean} [showSearchIcon=true] - 検索アイコンを表示するか
	 * @property {boolean} [showClearButton=true] - クリアボタンを表示するか
	 * @property {number} [debounceMs=300] - デバウンス時間（ミリ秒）
	 * @property {string} [className=''] - 追加のCSSクラス
	 */
	interface SearchInputProps {
		label?: string;
		id?: string;
		placeholder?: string;
		title?: string;
		value?: string;
		type?: 'search' | 'text';
		onInput?: (value: string) => void;
		onChange?: (value: string) => void;
		onSearch?: (value: string) => void;
		disabled?: boolean;
		required?: boolean;
		showSearchIcon?: boolean;
		showClearButton?: boolean;
		debounceMs?: number;
		className?: string;
	}

	/**
	 * コンポーネントの初期値
	 */
	const {
		label = '',
		id = '',
		title = '',
		placeholder = '検索...',
		value = '',
		type = 'search',
		onInput = undefined,
		onChange = undefined,
		onSearch = undefined,
		disabled = false,
		required = false,
		showSearchIcon = true,
		showClearButton = true,
		debounceMs = 300,
		className = ''
	}: SearchInputProps = $props();

	// 内部状態
	let inputValue = $state(value);
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	// propsのvalueが変更された時に内部状態を同期
	$effect(() => {
		// 外部からのvalue変更時のみ更新（無限ループを防ぐ）
		if (inputValue !== value) {
			inputValue = value;
		}
	});

	/**
	 * 入力時のハンドラー
	 * @param {Event} event - 入力イベント
	 */
	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const newValue = target.value;
		inputValue = newValue;

		// 即座にonInputコールバックを呼び出す
		if (typeof onInput === 'function') {
			onInput(newValue);
		}

		// デバウンス処理でonChangeコールバックを呼び出す
		if (typeof onChange === 'function') {
			if (debounceTimer) {
				clearTimeout(debounceTimer);
			}
			debounceTimer = setTimeout(() => {
				onChange(newValue);
			}, debounceMs);
		}
	}

	/**
	 * 変更時のハンドラー
	 * @param {Event} event - 変更イベント
	 */
	function handleChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const newValue = target.value;

		// デバウンスタイマーをクリア
		if (debounceTimer) {
			clearTimeout(debounceTimer);
			debounceTimer = null;
		}

		// onChangeコールバックを即座に呼び出す
		if (typeof onChange === 'function') {
			onChange(newValue);
		}
	}

	/**
	 * キーダウンハンドラー（Enterキーで検索実行）
	 * @param {KeyboardEvent} event - キーボードイベント
	 */
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && typeof onSearch === 'function') {
			event.preventDefault();
			onSearch(inputValue);
		}
	}

	/**
	 * 検索ボタンのハンドラー
	 */
	function handleSearchClick() {
		if (typeof onSearch === 'function') {
			onSearch(inputValue);
		}
	}

	/**
	 * インプットグループのクラスを取得する
	 * @returns {string} 適用するCSSクラス名の文字列
	 */
	function getInputGroupClasses(): string {
		const baseClasses = ['input-group'];

		// アイコンとボタンの配置に応じてグリッドを調整
		if (showSearchIcon && showClearButton) {
			baseClasses.push('grid-cols-[auto_1fr_auto_auto]');
		} else if (showSearchIcon || showClearButton) {
			baseClasses.push('grid-cols-[auto_1fr_auto]');
		} else {
			baseClasses.push('grid-cols-[1fr]');
		}

		return [baseClasses.join(' '), className].join(' ');
	}
</script>

<!-- ラベル表示 -->
{#if label}
	<label class="label" for={id}>
		<span class="label-text">{title || label}</span>
	</label>
{/if}

<!-- 検索インプット -->
<div class={getInputGroupClasses()}>
	<!-- 検索アイコン -->
	{#if showSearchIcon}
		<div class="ig-cell preset-tonal">
			<Search />
		</div>
	{/if}

	<!-- インプット要素 -->
	<input
		{id}
		{type}
		class="ig-input"
		{placeholder}
		value={inputValue}
		{disabled}
		{required}
		oninput={handleInput}
		onchange={handleChange}
		onkeydown={handleKeydown}
	/>

	<!-- 検索ボタン（onSearchが提供されている場合のみ表示） -->
	{#if onSearch}
		<button
			type="button"
			class="ig-btn preset-filled"
			onclick={handleSearchClick}
			title="検索"
			{disabled}
		>
			<Search />
		</button>
	{/if}
</div>
