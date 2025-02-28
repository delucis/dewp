import { AstroError } from 'astro/errors';
import type { DataStore, Loader } from 'astro/loaders';
import type { AstroIntegrationLogger } from 'astro';
import { defineCollection } from 'astro:content';
import {
	CategorySchema,
	CommentSchema,
	MediaSchema,
	PageSchema,
	PostSchema,
	SiteSettingsSchema,
	StatusSchema,
	TagSchema,
	TaxonomySchema,
	TypeSchema,
	UserSchema,
} from './schemas.js';

type DataEntry = Parameters<DataStore['set']>[0];

export function wpCollections({ endpoint }: { endpoint: string }) {
	if (!endpoint) {
		throw new AstroError(
			'Missing `endpoint` argument.',
			'Please pass a URL to your WordPress REST API endpoint as the `endpoint` option to the WordPress loader. Most commonly this looks something like `https://example.com/wp-json/`'
		);
	}
	if (!endpoint.endsWith('/')) endpoint += '/';
	const apiBase = new URL(endpoint);

	const l = (type: string) =>
		makeLoader({ name: `dewp-${type}`, url: new URL(`wp/v2/${type}`, apiBase) });

	return {
		posts: defineCollection({ schema: PostSchema, loader: l('posts') }),
		pages: defineCollection({ schema: PageSchema, loader: l('pages') }),
		tags: defineCollection({ schema: TagSchema, loader: l('tags') }),
		categories: defineCollection({ schema: CategorySchema, loader: l('categories') }),
		comments: defineCollection({ schema: CommentSchema, loader: l('comments') }),
		users: defineCollection({ schema: UserSchema, loader: l('users') }),
		media: defineCollection({ schema: MediaSchema, loader: l('media') }),
		statuses: defineCollection({ schema: StatusSchema, loader: l('statuses') }),
		taxonomies: defineCollection({ schema: TaxonomySchema, loader: l('taxonomies') }),
		types: defineCollection({ schema: TypeSchema, loader: l('types') }),
		'site-settings': defineCollection({
			schema: SiteSettingsSchema,
			loader: {
				name: 'dewp-site-settings',
				async load({ store, parseData }) {
					const id = 'settings';
					const rawData = await fetch(apiBase).then((res) => res.json());
					const data = await parseData({ id, data: rawData });
					store.set({ id, data });
				},
			},
		}),
	};
}

function makeLoader({ name, url }: { name: string; url: URL }) {
	const loader: Loader = {
		name,
		async load({ logger. store, parseData }) {
			const items = await fetchAll(logger. url);
			for (const rawItem of items) {
				const item = await parseData({ id: String(rawItem.id), data: rawItem });
				const storeEntry: DataEntry = { id: String(item.id), data: item };
				if (item.content?.rendered) {
					storeEntry.rendered = { html: item.content.rendered };
				}
				store.set(storeEntry);
			}
		},
	};
	return loader;
}

/**
 * Fetch all pages for a paginated WP endpoint.
 */
async function fetchAll(logger: AstroIntegrationLogger, url: URL, page = 1, results: any[] = []) {
	url.searchParams.set('per_page', '100');
	url.searchParams.set('page', String(page));
	logger.info(`Fetch ${url}`)
	const response = await fetch(url);
	let data = await response.json();
	if (!Array.isArray(data)) {
		if (typeof data === 'object') {
			data = Object.entries(data).map(([id, val]) => {
				if (typeof val === 'object') return { id, ...val };
				return { id };
			});
		} else {
			throw new AstroError(
				'Expected WordPress API to return an array of items.',
				`Received ${typeof data}:\n\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\``
			);
		}
	}
	results.push(...data);
	const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1');
	if (page < totalPages) return fetchAll(logger. url, page + 1, results);
	return results;
}
