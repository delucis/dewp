import { z } from 'astro/zod';
import { reference } from 'astro:content';

/**
 * Transform an ID of `0` to `undefined`.
 * (The WP API returns an ID of `0` if the relationship doesn’t exist, e.g. for `parent` on top-level items etc.)
 */
function coerceId(id: unknown) {
	return id ? String(id) : undefined;
}

export const PostSchema = z.object({
	id: z.number().describe('Unique identifier for the post.'),
	date: z.coerce.date().describe("The date the post was published, in the site's timezone."),
	date_gmt: z.coerce.date().describe('The date the post was published, as GMT.'),
	guid: z.object({ rendered: z.string() }).describe('The globally unique identifier for the post.'),
	modified: z.coerce
		.date()
		.describe("The date the post was last modified, in the site's timezone."),
	modified_gmt: z.coerce.date().describe('The date the post was last modified, as GMT.'),
	slug: z.string().describe('An alphanumeric identifier for the post unique to its type.'),
	status: z.string().describe('A named status for the post.'),
	type: z.string().describe('Type of post.'),
	link: z.string().url().describe('URL to the post.'),
	title: z.object({ rendered: z.string() }).describe('The title for the post.'),
	content: z
		.object({ rendered: z.string(), protected: z.boolean() })
		.describe('The content for the post.'),
	excerpt: z
		.object({ rendered: z.string(), protected: z.boolean() })
		.describe('The excerpt for the post.'),
	author: z
		.preprocess(coerceId, reference('users'))
		.describe('A reference to the author of the post.'),
	featured_media: z
		.preprocess(coerceId, reference('media').optional())
		.describe('A reference to the featured media for the post.'),
	comment_status: z
		.enum(['open', 'closed'])
		.describe('Whether or not comments are open on the post.'),
	ping_status: z.enum(['open', 'closed']).describe('Whether or not the post can be pinged.'),
	sticky: z.boolean().describe('Whether or not the post should be treated as sticky.'),
	template: z.string().describe('The theme file to use to display the post.'),
	format: z.string(),
	meta: z.array(z.any()).or(z.record(z.any())),
	categories: z
		.preprocess(coerceId, reference('categories'))
		.array()
		.describe('The terms assigned to the post in the category taxonomy as an array of references.'),
	tags: z
		.preprocess(coerceId, reference('tags'))
		.array()
		.describe('The terms assigned to the post in the post_tag taxonomy as an array of references.'),
});

export const PageSchema = z.object({
	id: z.number(),
	date: z.coerce.date(),
	date_gmt: z.coerce.date(),
	guid: z.object({ rendered: z.string() }),
	modified: z.coerce.date(),
	modified_gmt: z.coerce.date(),
	slug: z.string(),
	status: z.string(),
	type: z.string(),
	link: z.string(),
	title: z.object({ rendered: z.string() }),
	content: z.object({ rendered: z.string(), protected: z.boolean() }),
	excerpt: z.object({ rendered: z.string(), protected: z.boolean() }),
	author: z.number(),
	featured_media: z.number(),
	parent: z.preprocess(coerceId, reference('pages').optional()),
	menu_order: z.number(),
	comment_status: z.string(),
	ping_status: z.string(),
	template: z.string(),
	meta: z.array(z.any()).or(z.record(z.any())),
	// _links: LinksSchema,
});

export const TagSchema = z.object({
	id: z.number(),
	count: z.number(),
	description: z.string(),
	link: z.string().url(),
	name: z.string(),
	slug: z.string(),
	taxonomy: z.string(),
	meta: z.array(z.any()).or(z.record(z.any())),
});

export const CategorySchema = z.object({
	id: z.number(),
	count: z.number(),
	description: z.string(),
	link: z.string().url(),
	name: z.string(),
	slug: z.string(),
	taxonomy: z.string(),
	parent: z.preprocess(coerceId, reference('categories').optional()),
	meta: z.array(z.any()).or(z.record(z.any())),
});

export const CommentSchema = z.object({
	id: z.number(),
	author: z.number(),
	author_name: z.string(),
	author_url: z.string(),
	content: z.object({ rendered: z.string() }),
	date: z.coerce.date(),
	date_gmt: z.coerce.date(),
	link: z.string().url(),
	parent: z.preprocess(coerceId, reference('comments').optional()),
	post: z.number(),
	status: z.string(),
	type: z.string(),
	author_avatar_urls: z.record(z.string().url()),
	meta: z.array(z.any()).or(z.record(z.any())),
});

export const UserSchema = z.object({
	id: z.number(),
	name: z.string(),
	url: z.string(),
	description: z.string(),
	link: z.string().url(),
	slug: z.string(),
	avatar_urls: z.record(z.string().url()),
	meta: z.array(z.any()).or(z.record(z.any())),
});

export const MediaSchema = z.object({
	id: z.number(),
	date: z.coerce.date().nullable(),
	date_gmt: z.coerce.date().nullable(),
	guid: z.object({ rendered: z.string() }),
	link: z.string().url(),
	modified: z.coerce.date(),
	modified_gmt: z.coerce.date(),
	slug: z.string(),
	status: z.string(),
	type: z.string(),
	title: z.object({ rendered: z.string() }),
	author: z.preprocess(coerceId, reference('users')),
	comment_status: z.enum(['open', 'closed', '']),
	ping_status: z.enum(['open', 'closed']),
	meta: z.array(z.any()).or(z.record(z.any())),
	template: z.string(),
	alt_text: z.string(),
	caption: z.object({ rendered: z.string() }),
	description: z.object({ rendered: z.string() }),
	media_type: z.enum(['image', 'file']),
	mime_type: z.string(),
	media_details: z
		.object({
			filesize: z.number(),
			sizes: z.record(
				z.object({
					width: z.number(),
					height: z.number(),
					file: z.string(),
					filesize: z.number().optional(),
					mime_type: z.string(),
					source_url: z.string(),
				})
			),
		})
		.and(
			z.union([
				z.object({
					width: z.number(),
					height: z.number(),
					file: z.string(),
					image_meta: z.record(z.any()),
				}),
				z.object({
					dataformat: z.string(),
					channels: z.number(),
					sample_rate: z.number(),
					bitrate: z.number(),
					channelmode: z.string(),
					bitrate_mode: z.string(),
					lossless: z.boolean(),
					encoder_options: z.string(),
					compression_ratio: z.number(),
					fileformat: z.string(),
					mime_type: z.string(),
					length: z.number(),
					length_formatted: z.string(),
					encoded_by: z.string(),
					title: z.string(),
					encoder_settings: z.string(),
					artist: z.string(),
					album: z.string(),
				}),
				z.object({}),
			])
		)
		.or(z.object({})),
	post: z.preprocess(coerceId, reference('posts').optional()),
	source_url: z.string(),
});

export const StatusSchema = z.object({
	id: z.string(),
	name: z.string(),
	private: z.boolean().optional(),
	protected: z.boolean().optional(),
	public: z.boolean(),
	queryable: z.boolean(),
	show_in_list: z.boolean().optional(),
	slug: z.string(),
	date_floating: z.boolean(),
});

export const TaxonomySchema = z.object({
	id: z.string(),
	description: z.string(),
	hierarchical: z.boolean(),
	name: z.string(),
	slug: z.string(),
	types: z.string().array(),
	rest_base: z.string(),
	rest_namespace: z.string().default('wp/v2'),
});

export const TypeSchema = z.object({
	id: z.string(),
	description: z.string(),
	hierarchical: z.boolean(),
	name: z.string(),
	slug: z.string(),
	has_archive: z.boolean().optional(),
	taxonomies: z.string().array(),
	rest_base: z.string(),
	rest_namespace: z.string().default('wp/v2'),
	icon: z.string().nullable().default(null),
});

export const SiteSettingsSchema = z.object({
	id: z.literal('settings').default('settings'),
	name: z.string(),
	description: z.string(),
	url: z.string(),
	home: z.string(),
	gmt_offset: z.number(),
	timezone_string: z.string(),
	site_logo: z.preprocess(coerceId, reference('media').optional()),
	site_icon: z.preprocess(coerceId, reference('media').optional()),
	site_icon_url: z.string().optional(),
});
