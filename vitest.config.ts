import { defineConfig } from 'vitest/config';
import { svelteTesting } from '@testing-library/svelte/vite';

export default defineConfig({
	test: {
		coverage: {
			provider: 'v8',
			reportsDirectory: './coverage',
			reporter: ['text', 'html', 'json-summary'],
			all: true,
			include: [
				'src/shared/components/**/*.svelte',
				'src/features/**/ui/**/*.svelte',
				'src/entities/**/ui/**/*.svelte',
				'src/widgets/**/ui/**/*.svelte',
				'src/routes/**/*.svelte'
			],
			exclude: ['**/node_modules/**', '**/tests/**']
		},
		workspace: [
			{
				extends: './vite.config.ts',
				plugins: [svelteTesting()],
				test: {
					name: 'client',
					environment: 'jsdom',
					clearMocks: true,
					include: ['test/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['test/server/**'],
					setupFiles: ['./vitest-setup-client.ts']
				}
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['test/**/*.{test,spec}.{js,ts}'],
					exclude: ['test/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
