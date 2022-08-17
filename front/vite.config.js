import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import * as path from 'path';

/** @type {import('vite').UserConfig} */
export default defineConfig(({ command, mode }) => {
	void command; // Ignore
	const project_root = path.join(process.cwd(), '..');
	console.log(project_root);
	const env = loadEnv(mode, project_root, 'PUBLIC_');

	return {
		plugins: [sveltekit()],
		define: { env }
	};
});
