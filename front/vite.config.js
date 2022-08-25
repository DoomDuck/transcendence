import { sveltekit } from '@sveltejs/kit/vite';

/** @type {import('vite').UserConfig} */
export default {
	plugins: [
		sveltekit(),
	],
	server: {
		fs: { allow: ['..'] },
	},
	build: {
		commonjsOptions: {
			defaultIsModuleExports: true,
		}
	}
};
