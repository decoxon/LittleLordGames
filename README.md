# LittleLordGames Blog

Static blog for **[littlelordgames.com](https://littlelordgames.com)** — product
reviews and hobby progress updates. Built with [Astro](https://astro.build),
authored in Markdown, and deployed to IIS via GitHub Actions over FTPS.

Pixel/retro chrome (Press Start 2P / Silkscreen) with a highly readable body
font (Atkinson Hyperlegible); palette sampled from the brand logo.

## Quick start

```bash
npm install
npm run dev        # http://localhost:4321 (shows drafts + scheduled posts)
npm run build      # production build into dist/ (excludes drafts/future posts)
npm run preview    # serve the production build locally
```

**Writing posts:** see [AUTHORING.md](./AUTHORING.md).

## How it works

- **Content:** one folder per post under `src/content/blog/<slug>/` with an
  `index.md` and co-located images. Typed front matter (`src/content.config.ts`).
- **Feed:** newest-first, 10 posts/page, with a tag sidebar. Reviews and progress
  logs share one feed — filtered by tags, not separate sections.
- **Images:** relative Markdown images are auto-optimized to responsive WebP.
  An image title becomes a `<figcaption>`.
- **Search:** client-side full-text via [Pagefind](https://pagefind.app),
  indexed at build over post bodies only.
- **Feeds/SEO:** RSS at `/rss.xml`, `sitemap-index.xml`, per-page Open Graph /
  Twitter cards, `robots.txt`.
- **Drafts/scheduling:** `draft: true` and future `date:` posts are excluded
  from production; a daily cron rebuild publishes scheduled posts within ~24h.
- **Analytics:** cookieless [GoatCounter](https://www.goatcounter.com) — set the
  site code in `src/site.config.ts` to enable (off by default, no banner needed).

## Project layout

```
src/
  content.config.ts     content collection + schema
  site.config.ts        title, store URL, analytics, paging
  content/blog/         posts (folder per post)
  components/  layouts/  pages/  lib/  styles/
public/                  favicon, logo, og image, robots.txt, web.config (IIS)
.github/workflows/       deploy.yml (build + FTPS deploy)
planning/                requirements, implementation plan, launch checklist
```

## Deploy

Pushing to the canonical branch builds the site and deploys it to the IIS web
root (`/littlelord/wwwroot/`) via FTPS. See
[planning/launch-checklist.md](./planning/launch-checklist.md) for the one-time
setup (GitHub repo, secrets, canonical branch, GoatCounter, and the
sibling-folder dry-run) that must happen before the first production deploy.
