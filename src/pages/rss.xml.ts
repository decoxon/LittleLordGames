import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getPublishedPosts, postSummary } from '../lib/posts';
import { SITE } from '../site.config';

export const GET: APIRoute = async (context) => {
  const posts = await getPublishedPosts();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site?.href ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: postSummary(post),
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: `<language>en-gb</language>`,
  });
};
