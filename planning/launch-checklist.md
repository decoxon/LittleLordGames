# Launch checklist

The site is built and verified locally. These remaining items need GitHub access
and owner decisions — the repo is **not yet connected to GitHub**.

## Before the first deploy

- [ ] **Create the GitHub repo** and push this code to it.
- [ ] **Confirm the canonical branch.** This repo is currently on `master`; the
      deploy workflow triggers on both `main` and `master` for now. Pick one and
      trim `branches:` in `.github/workflows/deploy.yml`.
- [ ] **Add repository secrets** (Settings → Secrets and variables → Actions):
  - `FTPS_USER` — same FTPS user as the pythia deploy
  - `FTPS_PASS` — same FTPS password
- [ ] **⚠ Verify sibling-folder safety** (the blog deploys to the shared web root
      that also holds `pythia/` and `rules_staging/`):
  1. Run the **Build & Deploy** workflow manually (Actions → Run workflow) with
     **`dry_run` ticked**.
  2. Read the FTP-Deploy-Action log and confirm it lists **no deletions** under
     `pythia/` or `rules_staging/` (it shouldn't — the blog-specific
     `state-name` and `exclude` patterns prevent it).
  3. Only after that looks clean, run it again with `dry_run` unticked (or push)
     for the real deploy.

## Optional / when ready

- [ ] **GoatCounter:** create a site, then set `goatCounterCode` in
      `src/site.config.ts` to enable cookieless analytics.
- [ ] **Default OG image:** `public/og-default.png` is currently the logo art —
      swap for a wider branded card if desired (used when a post has no hero).

## Already done

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
