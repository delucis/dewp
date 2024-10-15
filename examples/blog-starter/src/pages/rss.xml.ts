import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { getSiteSettings } from 'dewp/content-utils';

export async function GET(context: APIContext) {
	const { name, description } = await getSiteSettings();
	const posts = await getCollection('posts');
	return rss({
		title: name,
		description: description,
		site: context.site || 'https://example.com',
		items: posts
			.sort((a, b) => (a.data.date < b.data.date ? 1 : a.data.date > b.data.date ? -1 : 0))
			.slice(0, 10)
			.map((post) => {
				return {
					link: `/blog/${post.data.id}/`,
					title: post.data.title.rendered,
					description: post.data.excerpt.rendered,
					pubDate: post.data.date,
					content: post.rendered?.html,
				};
			}),
	});
}
