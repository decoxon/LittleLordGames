// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';
import rehypeFigure from './src/lib/rehype-figure.mjs';

// Root site of littlelordgames.com (base '/'), unlike the sibling `pythia` app
// which bakes in a `/pythia` base path. `format: 'directory'` emits each route
// as `<slug>/index.html` so IIS serves clean URLs at `/<slug>/` with no rewrite.
export default defineConfig({
  site: 'https://littlelordgames.com',
  base: '/',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  integrations: [sitemap(), pagefind()],
  markdown: {
    // Astro 6: build on the default processor (keeps GFM, syntax highlighting,
    // heading IDs, and Markdown image optimization) and add our figure plugin.
    processor: unified({ rehypePlugins: [rehypeFigure] }),
  },
});
