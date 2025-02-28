import { z } from 'astro/zod';
import { reference } from 'astro:content';

/**
 * Transform an ID of `0` to `undefined`.
 * (The WP API returns an ID of `0` if the relationship doesn’t exist, e.g. for `parent` on top-level items etc.)
 */
function coerceId(id: unknown) {
	return id ? String(id) : undefined;
}

const OpenClosedSchema = z.enum(['open', 'closed', '']);

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
	title: z
		.object({
			rendered: z
				.string()
				.describe(
					'A rendered HTML string for the post title. Best used with Astro’s `set:html` directive.'
				),
		})
		.describe('The title for the post.'),
	content: z
		.object({
			rendered: z.string().describe('A rendered HTML string for the full post content.'),
			protected: z.boolean(),
		})
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
	comment_status: OpenClosedSchema.describe('Whether or not comments are open on the post.'),
	ping_status: OpenClosedSchema.describe('Whether or not the post can be pinged.'),
	sticky: z.boolean().describe('Whether or not the post should be treated as sticky.'),
	template: z.string().describe('The theme file to use to display the post.'),
	format: z
		.enum([
			'standard',
			'aside',
			'chat',
			'gallery',
			'link',
			'image',
			'quote',
			'status',
			'video',
			'audio',
			'',
		])
		.describe('The format for the post.'),
	meta: z.array(z.any()).or(z.record(z.any())).describe('Meta fields object or array.'),
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
	id: z.number().describe('Unique identifier for the page.'),
	date: z.coerce.date().describe("The date the page was published, in the site's timezone."),
	date_gmt: z.coerce.date().describe('The date the page was published, as GMT.'),
	guid: z.object({ rendered: z.string() }).describe('The globally unique identifier for the page.'),
	modified: z.coerce
		.date()
		.describe("The date the page was last modified, in the site's timezone."),
	modified_gmt: z.coerce.date().describe('The date the page was last modified, as GMT.'),
	slug: z.string().describe('An alphanumeric identifier for the page unique to its type.'),
	status: z
		.enum(['publish', 'future', 'draft', 'pending', 'private'])
		.describe('A named status for the page.'),
	type: z.string().describe('Type of page.'),
	link: z.string().describe('URL to the page.'),
	title: z
		.object({
			rendered: z
				.string()
				.describe(
					'A rendered HTML string for the page title. Best used with Astro’s `set:html` directive.'
				),
		})
		.describe('The title for the page.'),
	content: z
		.object({
			rendered: z.string().describe('A rendered HTML string for the full page content.'),
			protected: z.boolean(),
		})
		.describe('The content for the page.'),
	excerpt: z
		.object({
			rendered: z.string().describe('A rendered HTML string for the page excerpt.'),
			protected: z.boolean(),
		})
		.describe('The excerpt for the page.'),
	author: z
		.preprocess(coerceId, reference('users'))
		.describe('A reference to the author of the page.'),
	featured_media: z
		.preprocess(coerceId, reference('media').optional())
		.describe('A reference to the featured media for the post.'),
	parent: z
		.preprocess(coerceId, reference('pages').optional())
		.describe('A reference to a parent page.'),
	menu_order: z.number().describe('The order of the page in relation to other pages.'),
	comment_status: OpenClosedSchema.describe('Whether or not comments are open on this page.'),
	ping_status: OpenClosedSchema.describe('Whether or not the page can be pinged.'),
	template: z.string().describe('The theme file to use to display the page.'),
	meta: z.array(z.any()).or(z.record(z.any())).describe('Meta fields.'),
});

export const TagSchema = z.object({
	id: z.number().describe('Unique identifier for the term.'),
	count: z.number().describe('Number of published posts for the term.'),
	description: z.string().describe('HTML description of the term.'),
	link: z.string().url().describe('URL of the term.'),
	name: z.string().describe('HTML title for the term.'),
	slug: z.string().describe('An alphanumeric identifier for the term unique to its type.'),
	taxonomy: z.string().describe('Type attribution for the term.'),
	meta: z.array(z.any()).or(z.record(z.any())).describe('Meta fields.'),
});

export const CategorySchema = TagSchema.extend({
	parent: z
		.preprocess(coerceId, reference('categories').optional())
		.describe('A reference to a parent category.'),
});

export const CommentSchema = z.object({
	id: z.number().describe('Unique identifier for the comment.'),
	author: z
		.preprocess(coerceId, reference('users').optional())
		.describe('A reference to the author of the comment, if author was a user.'),
	author_name: z.string().describe('Display name for the comment author.'),
	author_url: z.string().describe('URL for the comment author.'),
	content: z.object({ rendered: z.string() }).describe('The content for the comment.'),
	date: z.coerce.date().describe("The date the comment was published, in the site's timezone."),
	date_gmt: z.coerce.date().describe('The date the comment was published, as GMT.'),
	link: z.string().url().describe('URL to the comment.'),
	parent: z
		.preprocess(coerceId, reference('comments').optional())
		.describe('A reference to a parent comment.'),
	post: z
		.preprocess(coerceId, z.union([reference('posts'), reference('pages')]).optional())
		.describe('A reference to the associated post.'),
	status: z.string().describe('State of the comment.'),
	type: z.string().describe('Type of the comment.'),
	author_avatar_urls: z.record(z.string().url()).describe('Avatar URLs for the comment author.'),
	meta: z.array(z.any()).or(z.record(z.any())).describe('Meta fields.'),
});

export const UserSchema = z.object({
	id: z.number().describe('Unique identifier for the user.'),
	name: z.string().describe('Display name for the user.'),
	url: z.string().describe('URL of the user.'),
	description: z.string().describe('Description of the user.'),
	link: z.string().url().describe('Author URL of the user.'),
	slug: z.string().describe('An alphanumeric identifier for the user.'),
	avatar_urls: z.record(z.string().url()).describe('Avatar URLs for the user.'),
	meta: z.array(z.any()).or(z.record(z.any())).describe('Meta fields.'),
});

export const MediaSchema = z.object({
	id: z.number().describe('Unique identifier for the item.'),
	date: z.coerce
		.date()
		.nullable()
		.describe("The date the item was published, in the site's timezone."),
	date_gmt: z.coerce.date().nullable().describe('The date the post was published, as GMT.'),
	guid: z.object({ rendered: z.string() }).describe('The globally unique identifier for the item.'),
	link: z.string().url().describe('URL to the media item.'),
	modified: z.coerce
		.date()
		.describe("The date the item was last modified, in the site's timezone."),
	modified_gmt: z.coerce.date().describe('The date the item was last modified, as GMT.'),
	slug: z.string().describe('An alphanumeric identifier for the item unique to its type.'),
	status: z
		.enum(['publish', 'future', 'draft', 'pending', 'private', 'inherit'])
		.describe('A named status for the item.'),
	type: z.string().describe('Type of item.'),
	title: z.object({ rendered: z.string() }).describe('The title for the post.'),
	author: z
		.preprocess(coerceId, reference('users'))
		.describe('A reference to the author of the post.'),
	comment_status: OpenClosedSchema.describe('Whether or not comments are open on the post.'),
	ping_status: OpenClosedSchema.describe('Whether or not the post can be pinged.'),
	meta: z.array(z.any()).or(z.record(z.any())).describe('Meta fields.'),
	template: z.string().describe('The theme file to use to display the post.'),
	alt_text: z.string().describe('Alternative text to display when attachment is not displayed.'),
	caption: z.object({ rendered: z.string() }).describe('The attachment caption.'),
	description: z.object({ rendered: z.string() }).describe('The attachment description.'),
	media_type: z.enum(['image', 'file']).describe('Attachment type.'),
	mime_type: z.string().describe('The attachment MIME type.'),
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
		.or(z.object({}))
		.describe('An object containing details about the media file, specific to its type.'),
	post: z
		.preprocess(coerceId, reference('posts').optional())
		.describe('The ID for the associated post of the attachment.'),
	source_url: z.string().describe('URL to the original attachment file.'),
});

export const StatusSchema = z.object({
	id: z.string().describe('Unique identifier for this status definition.'),
	name: z.string().describe('The title for the status.'),
	public: z
		.boolean()
		.describe('Whether posts of this status should be shown in the front end of the site.'),
	queryable: z.boolean().describe('Whether posts with this status should be publicly-queryable.'),
	slug: z.string().describe('An alphanumeric identifier for the status.'),
	date_floating: z
		.boolean()
		.optional()
		.describe('Whether posts of this status may have floating published dates.'),
});

export const TaxonomySchema = z.object({
	id: z.string().describe('Unique identifier for this taxonomy definition.'),
	description: z.string().describe('A human-readable description of the taxonomy.'),
	hierarchical: z.boolean().describe('Whether or not the taxonomy should have children.'),
	name: z.string().describe('The title for the taxonomy.'),
	slug: z.string().describe('An alphanumeric identifier for the taxonomy.'),
	types: z.string().array().describe('Types associated with the taxonomy.'),
	rest_base: z.string().describe('REST base route for the taxonomy.'),
	rest_namespace: z.string().default('wp/v2').describe('REST namespace route for the taxonomy.'),
});

export const TypeSchema = z.object({
	id: z.string().describe('A unique identifier for the post type.'),
	description: z.string().describe('A human-readable description of the post type.'),
	hierarchical: z.boolean().describe('Whether or not the post type should have children.'),
	name: z.string().describe('The title for the post type.'),
	slug: z.string().describe('An alphanumeric identifier for the post type.'),
	has_archive: z
		.union([z.boolean(), z.string()])
		.default(false)
		.describe(
			'If the value is a string, the value will be used as the archive slug. If the value is false the post type has no archive.'
		),
	taxonomies: z.string().array(),
	rest_base: z.string().describe('REST base route for the post type.'),
	rest_namespace: z.string().default('wp/v2').describe("REST route's namespace for the post type."),
	icon: z.string().nullable().default(null).describe('The icon for the post type.'),
});

export const SiteSettingsSchema = z.object({
	id: z.literal('settings').default('settings'),
	name: z.string().describe('The site title.'),
	description: z.string().describe('A human-readable description of the site.'),
	url: z.string().describe('The URL of the site.'),
	home: z.string().describe('The URL of the site homepage. (Usually the same as `url`.)'),
	gmt_offset: z.coerce
		.number()
		.describe("The site's timezone expressed as an offset in hours from GMT"),
	timezone_string: z.string().describe('The site\'s timezone as a string, e.g. `"Europe/Paris"`.'),
	site_logo: z
		.preprocess(coerceId, reference('media').optional())
		.describe('Reference to a media attachment to use as the site logo.'),
	site_icon: z
		.preprocess(coerceId, reference('media').optional())
		.describe('Reference to a media attachment to use as the site icon.'),
	site_icon_url: z.string().optional().describe('URL to a resource to use as the site icon.'),
});
