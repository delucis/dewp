# DeWP

Tools for migrating from WordPress to Astro

## Features

This project contains tools for incrementally migrating from WordPress to Astro.

- A set of content loaders, which load the content from a WordPress site into your Astro project.
- A blog template designed to handle WordPress data.
- More coming soon!

## Installation

1. Add DeWP to an existing Astro project:

   ```sh
   npm install dewp
   ```

2. Add the DeWP content loaders to `src/content/config.ts`, setting `endpoint` to the URL of your WordPress REST API.

   ```diff
   import { z, defineCollection } from 'astro:content';
   import { wpCollections } from 'dewp/loaders';

   export const collections = {
   	// existing collections ...
   	...wpCollections({ endpoint: 'https://example.com/wp-json/' }),
   };
   ```

3. You can now use Astro’s [content collection APIs](https://5-0-0-beta.docs.astro.build/en/guides/content-collections/) to get your WordPress data.

## License

MIT
