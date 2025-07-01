<script lang="ts">
	// アイコン
	import ChevronDown from '$shared/icons/ChevronDown.svelte';
	// バリデーション
	import type { ValidationResult } from '$shared/utils/validatons/required';

	// バリデーション関数の型定義
	type ValidationFunction = (value: unknown, ...args: any[]) => ValidationResult;

	// 型定義
	interface Props {
		options?: { value: string; label: string }[];
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		required?: boolean;
		name?: string;
		id?: string;
		size?: 'sm' | 'md' | 'lg';
		theme?: 'light' | 'dark';
		validationFunctions?: ValidationFunction[];
		showError?: boolean;
		label?: string;
		onchange?: (value: string, option?: { value: string; label: string }) => void;
		onvalidation?: (result: ValidationResult) => void;
	}

	// プロパティ
	let {
		options = [],
		value = $bindable(''),
		placeholder = '選択してください',
		disabled = false,
		required = false,
		name = '',
		id = '',
		size = 'md',
		theme = 'light',
		validationFunctions = [],
		showError = true,
		label,
		onchange,
		onvalidation
	}: Props = $props();

	// 状態管理
	let isOpen = $state(false);
	let dropdownRef: HTMLDivElement;
	let validationResult = $state<ValidationResult>({ isValid: true });
	let hasBlurred = $state(false); // blur状態を管理

	// 選択されたオプションを取得
	const selectedOption = $derived(options.find((option) => option.value === value));

	// バリデーション実行
	function validateValue(currentValue: string): ValidationResult {
		if (validationFunctions.length === 0) {
			return { isValid: true };
		}

		for (const validation of validationFunctions) {
			const result = validation(currentValue);
			if (!result.isValid) {
				return result;
			}
		}

		return { isValid: true };
	}

	// 値変更時のバリデーション
	$effect(() => {
		if (hasBlurred) {
			const result = validateValue(value);
			validationResult = result;
			onvalidation?.(result);
		}
	});

	// blur時のハンドラー
	function handleBlur() {
		hasBlurred = true;
		const result = validateValue(value);
		validationResult = result;
		onvalidation?.(result);
	}

	// 外部からバリデーションを実行する関数を公開
	export function validate(): ValidationResult {
		hasBlurred = true; // 強制バリデーション時はblur状態にする
		const result = validateValue(value);
		validationResult = result;
		return result;
	}

	// クラス名を生成
	function getClasses(size: 'sm' | 'md' | 'lg', theme: 'light' | 'dark') {
		const baseClasses = `form-element size-${size} theme-${theme} hover-theme focus-theme disabled-theme cursor-pointer relative`;
		const errorClasses = !validationResult.isValid && hasBlurred ? 'border-red-500' : '';
		return `${baseClasses} ${errorClasses}`;
	}

	// ドロップダウンを開く/閉じる
	function toggleDropdown() {
		if (!disabled) {
			isOpen = !isOpen;
		}
	}

	// オプションを選択
	function selectOption(option: { value: string; label: string }) {
		value = option.value;
		isOpen = false;
		onchange?.(option.value, option);
		// 選択時にblurイベントを発火
		handleBlur();
	}

	// キーボード操作でドロップダウンを制御
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			isOpen = false;
		} else if (event.key === 'ArrowDown' && !isOpen) {
			isOpen = true;
		}
	}

	// 外部クリックでドロップダウンを閉じる
	function handleClickOutside(event: MouseEvent) {
		if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
			isOpen = false;
		}
	}

	// コンポーネントマウント時にイベントリスナーを設定
	$effect(() => {
		document.addEventListener('click', handleClickOutside);
		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});
</script>

<div bind:this={dropdownRef} class="relative">
	<!-- ラベル -->
	{#if label}
		<label class="mb-2 block text-sm font-medium" for={id}>
			{label}
		</label>
	{/if}

	<!-- フォーム送信用の隠しinput -->
	<input type="hidden" {name} {id} {value} {required} />

	<!-- カスタムセレクトボタン -->
	<button
		type="button"
		{disabled}
		onclick={toggleDropdown}
		onkeydown={handleKeydown}
		onblur={handleBlur}
		class={getClasses(size, theme)}
		aria-haspopup="listbox"
		aria-expanded={isOpen}
	>
		<span class="flex-1 text-left">
			{selectedOption?.label || placeholder}
		</span>

		<ChevronDown className="ml-2 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}" />
	</button>

	<!-- ドロップダウンメニュー -->
	{#if isOpen}
		<div
			class="absolute z-10 mt-1 w-full rounded-md border shadow-lg theme-{theme} max-h-60 overflow-auto"
		>
			{#each options as option}
				<button
					type="button"
					class="hover-theme focus-theme w-full px-3 py-2 text-left"
					onclick={() => selectOption(option)}
				>
					{option.label}
				</button>
			{/each}
		</div>
	{/if}

	<!-- エラーメッセージ -->
	{#if showError && !validationResult.isValid && validationResult.errorMessage && hasBlurred}
		<div class="mt-1 text-sm text-red-600">
			{validationResult.errorMessage}
		</div>
	{/if}
</div>
