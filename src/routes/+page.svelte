<script lang="ts">
	import type { PageData } from './$types';
	import Select from '$shared/components/Select.svelte';
	import { required } from '$shared/utils/validatons/required';
	import { ERROR_MESSAGES } from '$shared/utils/validatons/errorMessage';
	import type { ValidationResult } from '$shared/utils/validatons/required';

	const { data } = $props<{ data: PageData }>();

	let samples = $state(data.samples);

	// コンポーネントの参照を保持する変数
	let categorySelectRef: Select | undefined = $state();
	let prioritySelectRef: Select | undefined = $state();
	let statusSelectRef: Select | undefined = $state();

	let formData = $state({
		category: '',
		priority: '',
		status: ''
	});

	// バリデーション結果を管理
	let validationResults = $state<Record<string, ValidationResult>>({});

	// バリデーション結果のハンドラー（リアルタイム表示用）
	function handleValidation(field: string) {
		return (result: ValidationResult) => {
			validationResults[field] = result;
		};
	}

	// 全てのSelectコンポーネントのバリデーションを一括実行
	function validateAllSelects(): ValidationResult[] {
		const results: ValidationResult[] = [];

		// 各Selectコンポーネントのバリデーションを実行
		const categoryResult = categorySelectRef?.validate();
		const priorityResult = prioritySelectRef?.validate();
		const statusResult = statusSelectRef?.validate();

		if (categoryResult) results.push(categoryResult);
		if (priorityResult) results.push(priorityResult);
		if (statusResult) results.push(statusResult);

		return results;
	}

	// フォーム送信時のバリデーション
	function handleSubmit() {
		const validationResults = validateAllSelects();

		console.log('バリデーション結果:', validationResults);

		// 全てのバリデーションが通った場合のみ送信
		const allValid = validationResults.every((result) => result.isValid);

		if (allValid) {
			alert('送信完了！');
		} else {
			alert('入力内容を確認してください');
		}
	}
</script>

<div class="col-span-4">
	<Select
		bind:this={categorySelectRef}
		bind:value={formData.category}
		theme="dark"
		label="カテゴリ（必須）"
		options={[
			{ value: 'option1', label: 'オプション1' },
			{ value: 'option2', label: 'オプション2' },
			{ value: 'option3', label: 'オプション3' }
		]}
		placeholder="カテゴリを選択してください"
		validationFunctions={[(value) => required(value, ERROR_MESSAGES.REQUIRED)]}
		onvalidation={handleValidation('category')}
	/>
</div>

<div class="col-span-4">
	<Select
		bind:this={prioritySelectRef}
		bind:value={formData.priority}
		theme="dark"
		label="優先度（必須）"
		options={[
			{ value: 'high', label: '高' },
			{ value: 'medium', label: '中' },
			{ value: 'low', label: '低' }
		]}
		placeholder="優先度を選択してください"
		validationFunctions={[(value) => required(value, ERROR_MESSAGES.REQUIRED)]}
		onvalidation={handleValidation('priority')}
	/>
</div>

<div class="col-span-4">
	<Select
		bind:this={statusSelectRef}
		bind:value={formData.status}
		theme="dark"
		label="ステータス"
		options={[
			{ value: 'todo', label: 'TODO' },
			{ value: 'progress', label: '進行中' },
			{ value: 'done', label: '完了' }
		]}
		placeholder="ステータスを選択してください"
		onvalidation={handleValidation('status')}
	/>
</div>

<div class="col-span-4">
	<button onclick={handleSubmit} class="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
		送信
	</button>
</div>
