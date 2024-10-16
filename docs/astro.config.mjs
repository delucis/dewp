// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	site: 'https://delucis.github.io',
	base: '/dewp',
	integrations: [
		starlight({
			title: 'DeWP',
			description: 'Use your WordPress data in Astro projects',
			social: {
				github: 'https://github.com/delucis/dewp',
			},
			sidebar: ['index', { label: 'Reference', items: ['reference/collections'] }],
		}),
	],
});
