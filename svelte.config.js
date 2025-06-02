import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	compilerOptions: {
		runes: true
	},
	kit: {
		files: {
			assets: 'src/shared/static/img'
		},
		alias: {
			$shared: './src/shared',
			$entities: './src/entities',
			$features: './src/features',
			$widgets: './src/widgets',
		},
		adapter: adapter()
	}
};

export default config;
