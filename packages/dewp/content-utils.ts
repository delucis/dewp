import { getEntry, type CollectionEntry } from 'astro:content';

/**
 * Get settings from the `site-settings` content collection.
 * Includes `name` (the site title), `description`, and a couple of other handy bits of metadata.
 */
export async function getSiteSettings() {
	const entry = await getEntry('site-settings', 'settings');
	return entry.data;
}

/**
 * If pages have parents, WordPress prepends parent slugs to the page slug.
 * For example, given a `lion` page with a `big-cats` parent, the page would be served at `/big-cats/lion`.
 *
 * This function resolves parent pages to construct a multi-segment path like that.
 *
 * @example
 * const lionPage = await getEntry('pages', 'lion');
 * const slug = await resolvePageSlug(lionPage);
 * //    ^ 'big-cats/lion'
 */
export async function resolvePageSlug(page: CollectionEntry<'pages'>) {
	let { parent } = page.data;
	const segments = [page.data.slug];
	while (parent) {
		const resolvedParent = await getEntry(parent);
		parent = resolvedParent.data.parent;
		segments.unshift(resolvedParent.data.slug);
	}
	return segments.join('/');
}
