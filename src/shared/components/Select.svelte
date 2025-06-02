<script lang="ts">
	/**
	 * セレクトボックスコンポーネント
	 * @component Select
	 */

	/**
	 * コンポーネントのプロパティ定義
	 * @typedef {Object} SelectProps
	 * @property {Array<{label: string, value: string}>} [options] - オプションリスト
	 * @property {string} [label] - ラベル
	 * @property {string} [id] - セレクトボックスのID
	 * @property {string} [placeholder='検索...'] - プレースホルダーテキスト
	 * @property {string} [title] - セレクトボックスのタイトル
	 * @property {string} [value=''] - 選択値
	 * @property {string} [className=''] - 追加のCSSクラス
	 * @property {Function} [onChange] - 選択時のコールバック関数
	 * @property {boolean} [disabled=false] - 無効状態の指定
	 * @property {boolean} [required=false] - 必須項目の指定
	 */
	interface SelectProps {
		options?: { label: string; value: string }[];
		label?: string;
		id?: string;
		placeholder?: string;
		title?: string;
		value?: string;
		className?: string;
		onChange?: (value: string) => void;
		disabled?: boolean;
		required?: boolean;
	}

	/**
	 * コンポーネントの初期値
	 */
	const {
		options = [],
		label = '',
		id = '',
		title = '',
		placeholder = 'Select...',
		value = '',
		className = '',
		onChange = undefined,
		disabled = false,
		required = false
	}: SelectProps = $props();

	/**
	 * 選択が変更されたときのハンドラー
	 * @param {Event} event - 変更イベント
	 */
	function handleChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const newValue = target.value;

		// コールバック関数が提供されている場合は呼び出す
		if (typeof onChange === 'function') {
			onChange(newValue);
		}
	}

	/**
	 * セレクトボックスのスタイルクラスを取得する
	 * @returns {string} 適用するCSSクラス名の文字列
	 */
	function getSelectClasses(): string {
		// 状態のマッピング
		const stateMap: Record<string, string> = {
			true: 'select-disabled',
			false: ''
		};

		// 必須項目のマッピング
		const requiredMap: Record<string, string> = {
			true: 'select-required',
			false: ''
		};

		return ['select', stateMap.disabled, requiredMap.required, className].filter(Boolean).join(' ');
	}
</script>

{#if label}
	<label class="label" for={id}>
		<span class="label-text">{title}</span>
	</label>
{/if}

<select {id} class={getSelectClasses()} {value} onchange={handleChange} {disabled} {required}>
	<option value="">{placeholder}</option>
	{#each options as option}
		<option value={option.value}>{option.label}</option>
	{/each}
</select>
