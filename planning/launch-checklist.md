# Launch checklist

The site is live: connected to GitHub, deploying to the IIS web root via FTPS,
and publishing on push. The pre-launch blockers below are all complete.

All launch and optional items are complete.

## Done

- ✅ **GitHub repo** created and pushed (`decoxon/LittleLordGames`).
- ✅ **Canonical branch** confirmed `main`; deploy workflow trimmed to
      `branches: [main]`.
- ✅ **Repository secrets** (`FTPS_USER`, `FTPS_PASS`) added.
- ✅ **Sibling-folder safety** verified — deploys to the shared web root leave
      `pythia/` and `rules_staging/` untouched.
- ✅ **GoatCounter** enabled (`goatCounterAccount` set in `src/site.config.ts`).
- ✅ **Branded OG card** — `public/og-default.png` is a 1200×630 social card
      (brand logo + "Little Lord Games" wordmark on deep teal).
- ✅ Astro site: feed (10/page) + tag sidebar, post pages, tag pages, 404
- ✅ Image optimization (responsive WebP) + Markdown captions
- ✅ Client-side Pagefind search (post bodies only)
- ✅ RSS, sitemap, Open Graph / Twitter cards, robots.txt
- ✅ Drafts + future-date scheduling (daily cron rebuild)
- ✅ Pixel/retro theme, light/dark toggle, responsive, a11y (skip link, focus,
      alt text, semantic landmarks)
- ✅ IIS `web.config` (MIME maps incl. Pagefind binaries, custom 404, caching)
- ✅ GitHub Actions build + FTPS deploy workflow with shared-root safeguards
- ✅ Authoring guide (`AUTHORING.md`) + one seed post (+ migrated draft)
