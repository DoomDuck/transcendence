import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import * as path from 'path';

/** @type {import('vite').UserConfig} */
export default defineConfig(({command, mode}) => {
	void command; // Ignore
	const project_root = path.join(process.cwd(), "..");

	return {
		plugins: [sveltekit()],
		envDir: project_root,
		envPrefix: 'PUBLIC_',
	}
}); 
