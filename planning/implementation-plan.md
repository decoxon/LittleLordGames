# LittleLordGames Blog — Implementation Plan

_Status: Implementation plan (post-clarification, 2026-06-11). Derived from `requirements.md` plus the four locked decisions below. Ready to start building._

## 0. Locked decisions (this session)

| Topic | Decision |
|---|---|
| Stack / start point | **Astro, fresh in this repo** (`LittleLordGames`). The Hugo `llblog` prototype is abandoned. |
| Design tokens | **Locked now.** Chrome: _Press Start 2P_. Body: _Atkinson Hyperlegible_. Palette sampled from the logo (see §7). |
| Analytics | **GoatCounter via placeholder** — script wired behind a config value; owner drops in the site code later. |
| Production deploy | **Auto-deploy on push to default branch + daily cron**, straight to the live shared web root, with sibling-folder exclusions + a blog-specific sync-state file. |

### Defaults taken without asking (flagged for review)
- **Seed content:** migrate the `llblog` "Chain of Command v2" draft into the Astro schema; add one sample published post + an `AUTHORING.md` guide.
- **Deploy branch:** trigger on the default branch. ⚠ This repo is currently on `master`; the harness reports `main` as default. **Owner to confirm which branch is canonical** before wiring the workflow trigger.
- **Pixel font scope:** Press Start 2P is wide/blocky — use it only for logo / H1–H2 / tag chips; pair a lighter companion pixel face (e.g. _Pixelify Sans_ or _Silkscreen_) for nav so chrome stays legible.

---

## 1. Technology stack

- **Generator:** Astro 5 (Content Layer API, typed content collections).
- **Language/runtime:** Node 24 (matches Pythia toolchain), npm.
- **Images:** `astro:assets` (`<Image>`/`<Picture>`, Sharp) — responsive `srcset`, modern formats (AVIF/WebP). Relative images in Markdown are auto-optimized.
- **Search:** Pagefind (static index built over `dist/` as a postbuild step; fully client-side).
- **Feeds/SEO:** `@astrojs/rss`, `@astrojs/sitemap`.
- **Analytics:** GoatCounter cookieless `<script>`, behind a site-config flag.
- **Styling:** hand-rolled CSS with design tokens (CSS custom properties) — no heavy framework needed for a bespoke pixel theme. Optional light use of Astro scoped styles.

Key dependencies (indicative):
`astro`, `@astrojs/rss`, `@astrojs/sitemap`, `astro-pagefind` (or raw `pagefind` CLI), `sharp` (bundled), `@fontsource/press-start-2p`, `@fontsource/atkinson-hyperlegible`, plus the companion pixel font via Fontsource.

---

## 2. Project structure

```
/
├─ astro.config.mjs          # site URL, base '/', format:'directory', integrations
├─ src/
│  ├─ content.config.ts      # blog collection + Zod schema (front matter)
│  ├─ content/
│  │  └─ blog/
│  │     └─ <slug>/          # one folder per post (co-located images)
│  │        ├─ index.md
│  │        └─ *.png|jpg     # drag-dropped images live here
│  ├─ components/            # Header, Nav, ThemeToggle, PostCard, TagChip, TagSidebar, Search, SEO, Analytics
│  ├─ layouts/               # BaseLayout, PostLayout
│  ├─ pages/
│  │  ├─ [...page].astro     # paginated home feed (10/page)
│  │  ├─ blog/[...slug].astro# post detail
│  │  ├─ tags/index.astro    # all tags
│  │  ├─ tags/[tag]/[...page].astro  # per-tag paginated feed
│  │  ├─ search.astro        # client-side search results (Pagefind UI)
│  │  ├─ rss.xml.ts          # RSS/Atom feed
│  │  └─ 404.astro
│  └─ styles/
│     └─ tokens.css          # palette + font + spacing variables (light/dark)
├─ public/                   # favicon, logo, robots.txt, web.config (IIS)
├─ .github/workflows/
│  └─ deploy.yml             # build + Pagefind + FTPS deploy (push + cron + dispatch)
├─ AUTHORING.md              # how to write/paste-image/publish a post
└─ planning/                 # requirements.md, implementation-plan.md
```

**Clean URLs:** `build.format: 'directory'` → each post emits `/<slug>/index.html`, which IIS serves natively at `/<slug>/` with no rewrite rules.

---

## 3. Content model

`src/content.config.ts` — `glob` loader over `src/content/blog/**/*.md`, with a Zod schema:

| Field | Type | Notes |
|---|---|---|
| `title` | string, required | |
| `date` | date, required | drives ordering + scheduling |
| `tags` | string[], required | unified taxonomy; e.g. `review`, `progress`, subject tags |
| `excerpt` / `description` | string, optional | auto-derived from body if omitted |
| `heroImage` | `image()` helper, optional | card + OG image; optimized |
| `draft` | boolean, default false | excluded from production builds |

- **Slug:** folder name (clean slug), overridable via front matter if needed.
- **Image co-location:** post-as-folder lets the drag-drop editor save images next to `index.md`; relative refs auto-optimize.

### Drafts & scheduling logic
Shared content filter used by every listing/feed/index:
- `import.meta.env.PROD` → exclude `draft === true` **and** `date > now`.
- Dev → show everything (drafts + future-dated) for preview.
- A **daily cron** rebuild re-evaluates `date > now`, publishing scheduled posts within ~24h. Build-on-push handles immediate posts.

---

## 4. Pages & features

- **Home feed** (`[...page]`): published-date desc, excerpt cards (title, date, thumbnail, tags, excerpt) linking to post pages; numbered pagination at **10/page** via Astro `paginate()`.
- **Post page:** full Markdown (headings, links, lists, code, blockquotes, captioned responsive images), title, date, tag chips → tag views; OG/Twitter card meta.
- **Tags:** `TagSidebar` filter on the feed; per-tag paginated pages; all-tags index.
- **Search:** Pagefind UI on `/search`; index generated at build over `dist/`. Search entry point in the top bar.
- **RSS/Atom:** `rss.xml` of latest published posts.
- **404:** custom pixel-styled page; wired in `web.config`.
- **Nav:** Home · Store (outbound `https://www.ebay.co.uk/usr/littlelordgames`, `target="_blank" rel="noopener"`) · dark-mode toggle · search.

---

## 5. Theming & design system (§7 tokens locked)

`src/styles/tokens.css` — palette sampled from the logo, exposed as CSS variables with light/dark variants:

```
--mint:      #7FCCB8   /* surfaces / accents          */
--deep-teal: #2F6D63   /* headings / chrome           */
--ink:       #1A2E2B   /* body text (light mode)       */
--bone:      #D8C9A3   /* horn / warm accent           */
--lime:      #9BD64A   /* links / CTAs                 */
--night:     #0E1513   /* dark-mode background         */
```

- **Fonts:** Press Start 2P (chrome: logo/H1–H2/tag chips) + a lighter companion pixel face for nav; **Atkinson Hyperlegible** for post body + captions (image-heavy reviews stay legible). Self-host via Fontsource (no external font CDN → privacy + performance).
- **Dark mode:** toggle with `localStorage`-persisted preference + inline no-flash script in `<head>`; both themes meet WCAG AA contrast.
- **Responsive:** mobile-first; tag sidebar collapses on small screens.
- **Accessibility:** semantic landmarks, alt text enforced (schema/lint), keyboard-navigable nav/toggle/search, visible focus states.

---

## 6. SEO & metadata

- Per-page `<title>`/`<meta description>`; canonical URLs (clean slugs).
- Open Graph + Twitter card tags (uses `heroImage` or a default brand image).
- `sitemap.xml` (`@astrojs/sitemap`), `robots.txt`, RSS auto-discovery `<link>`.
- `site:` set to `https://littlelordgames.com`, `base: '/'` (root — unlike Pythia's `/pythia`).

---

## 7. Analytics

- GoatCounter cookieless script injected by an `Analytics.astro` component, gated on a `SITE.goatCounterCode` config value.
- Empty/placeholder by default → no script emitted until owner supplies the code. No cookie-consent banner needed.

---

## 8. CI/CD — GitHub Actions (mirrors Pythia, adapted to root)

Single workflow `.github/workflows/deploy.yml`:

```
on:
  push:        { branches: [<default-branch>] }
  schedule:    [ { cron: '0 5 * * *' } ]   # daily — publishes scheduled posts
  workflow_dispatch:
```

Steps:
1. `actions/checkout`
2. `actions/setup-node@v4` (Node 24, npm cache)
3. `npm ci`
4. `npm run build` → Astro build **then** Pagefind index over `dist/`
5. Deploy via FTPS:

```yaml
- uses: SamKirkland/FTP-Deploy-Action@v4.3.6
  with:
    server: wsuk36.pronameserver.com
    username: ${{ secrets.FTPS_USER }}
    password: ${{ secrets.FTPS_PASS }}
    protocol: ftps
    server-dir: /littlelord/wwwroot/      # the web ROOT itself
    local-dir: dist/
    state-name: .ftp-deploy-sync-state-blog.json
    exclude: |
      **/.git*
      **/node_modules/**
      pythia/**
      rules_staging/**
```

### ⚠ Sibling-folder safety (critical, verify before first prod deploy)
The blog deploys to the shared root that *contains* `pythia/` and `rules_staging/`.
- Use a **blog-specific `state-name`** so the action only tracks its own files.
- Add **`exclude` patterns** for every sibling app (`pythia/**`, `rules_staging/**`).
- **Dry-run / dangerous-clean-disabled first launch:** confirm on a throwaway run (or with the action's logging) that no sibling paths are scheduled for deletion before the first real push.

---

## 9. IIS configuration (`public/web.config`)

- Correct MIME types for `.webp`, `.avif`, `.woff2`, `.json`, `.xml`.
- Custom **404** → `/404/index.html` via `<httpErrors>`.
- `Cache-Control` headers: long-lived immutable for hashed assets (`/_astro/*`), short for HTML.
- Clean URLs served natively by `format:'directory'` (folder + `index.html`); no rewrite module dependency. Optional rewrite to drop/normalize trailing slashes if desired.
- Confirm Astro asset paths resolve at root (`base:'/'`).

---

## 10. Authoring workflow (`AUTHORING.md`)

1. New post: create `src/content/blog/<slug>/index.md` (an archetype/snippet provided), fill front matter.
2. Drag/paste images in Obsidian or VS Code (paste-image extension) → saved into the post folder, relative link inserted, auto-optimized at build.
3. Set `draft: true` while writing; future `date:` to schedule.
4. Commit + push → Actions builds & deploys; scheduled/draft posts appear when eligible + rebuilt.

---

## 11. Phased delivery

1. **Scaffold** — Astro project, config (site/base/format), content schema, base layout, tokens, fonts.
2. **Core pages** — home feed + pagination, post page, tag pages/sidebar, 404.
3. **Build features** — image pipeline verification, RSS, sitemap, drafts/scheduling filter.
4. **Search** — Pagefind integration + `/search` UI.
5. **Theme polish** — pixel chrome, dark-mode toggle, responsive, a11y pass.
6. **SEO/Analytics** — OG/meta, robots, GoatCounter placeholder.
7. **CI/CD + IIS** — `deploy.yml`, `web.config`, sibling-exclusion verification.
8. **Seed content** — migrate Chain of Command draft, sample post, authoring guide.
9. **Launch checklist** — secrets set, branch confirmed, dry-run deploy, first push.

---

## 12. Owner to-dos (outside the build)

- [ ] Create the GitHub repo (if this local repo isn't pushed yet) and add secrets **`FTPS_USER`** / **`FTPS_PASS`** (same as Pythia).
- [ ] Confirm canonical deploy branch (`main` vs `master`).
- [ ] Create a GoatCounter site and provide the code (or leave placeholder).
- [ ] Sign off the first production deploy after the sibling-exclusion dry-run.

## 13. Risks / watch-items

- **Shared-root deploy** wiping siblings — mitigated by exclusions + blog-specific state + dry-run (§8).
- **Press Start 2P legibility** in nav — mitigated by companion pixel font + scoped usage.
- **Branch mismatch** (`master` vs `main`) — resolve before wiring the trigger.
- **Pagefind + `base:'/'`** path correctness — verify search assets load at root.
