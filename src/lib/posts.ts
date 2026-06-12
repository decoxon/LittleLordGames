import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE } from '../site.config';

export type Post = CollectionEntry<'blog'>;

/**
 * All publishable posts, newest first.
 *
 * In production builds, drafts and future-dated posts are excluded — the daily
 * GitHub Actions cron rebuild re-evaluates the date so scheduled posts go live
 * within ~24h. In `dev` everything is shown so drafts/scheduled posts preview.
 */
export async function getPublishedPosts(): Promise<Post[]> {
  const now = Date.now();
  const posts = await getCollection('blog', ({ data }) => {
    if (import.meta.env.PROD) {
      return data.draft !== true && data.date.getTime() <= now;
    }
    return true;
  });
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Short summary for cards/meta: explicit excerpt/description, else derived. */
export function postSummary(post: Post): string {
  if (post.data.excerpt) return post.data.excerpt;
  if (post.data.description) return post.data.description;
  const body = (post.body ?? '')
    .replace(/^---[\s\S]*?---/, '') // strip any stray front matter
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
    .replace(/[#>*_`~\-]/g, '') // md punctuation
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> text
    .replace(/\s+/g, ' ')
    .trim();
  return body.length > 160 ? `${body.slice(0, 157).trimEnd()}…` : body;
}

/** Unique tags across published posts, with counts, sorted by frequency. */
export async function getAllTags(): Promise<{ tag: string; count: number }[]> {
  const posts = await getPublishedPosts();
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

/** Posts carrying a given tag, newest first. */
export async function getPostsByTag(tag: string): Promise<Post[]> {
  const posts = await getPublishedPosts();
  return posts.filter((p) => p.data.tags.includes(tag));
}

/** Human-readable publish date, e.g. "11 June 2026". */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Slugify a tag for clean URLs (/tags/<slug>/). */
export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const POSTS_PER_PAGE = SITE.postsPerPage;
