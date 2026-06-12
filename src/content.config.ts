import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Single content type: blog post. Posts live as folders under
 * `src/content/blog/<slug>/index.md` so drag-/paste-dropped images can be
 * co-located with the post and auto-optimized. `generateId` strips the
 * `/index` suffix so the route slug is just the folder name.
 */
const blog = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/blog',
    generateId: ({ entry }) => entry.replace(/\/index\.md$/, '').replace(/\.md$/, ''),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // publish date/time — drives ordering and scheduling
      date: z.coerce.date(),
      // unified taxonomy; e.g. ['review', 'progress', ...subject tags]
      tags: z.array(z.string()).nonempty('At least one tag is required'),
      // short summary for cards + meta; auto-derived from body if omitted
      excerpt: z.string().optional(),
      description: z.string().optional(),
      // card + social-preview image; optimized by the build
      heroImage: image().optional(),
      heroAlt: z.string().optional(),
      // drafts are excluded from production builds
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog };
