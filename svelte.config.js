import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	compilerOptions: {
		runes: true
	},
	kit: {
		adapter: adapter(),
		alias: {
			$entities: './src/entities',
			$features: './src/features',
			$shared: './src/shared',
			$routes: './src/routes',
			$widgets: './src/widgets'
		}
	}
};

export default config;
