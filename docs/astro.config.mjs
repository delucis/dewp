// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'DeWP',
			description: 'Tools for migrating from WordPress to Astro',
			social: {
				github: 'https://github.com/delucis/dewp',
			},
		}),
	],
});
