# LittleLordGames Blog — Requirements

_Status: Requirements draft (post-discovery interview, 2026-06-11). Detailed enough to select a stack and plan the build._

## 1. Overview

A personal blog for **littlelordgames.com** hosting **product reviews** and **hobby
progress updates**, with an outbound link to the owner's eBay store. The site is a
**static website** (pre-rendered HTML/CSS/JS, no application server or database),
authored in **Markdown**, built by a CI pipeline, and served from **IIS**.

Brand: pixel-art creature logo (see `assets/LittleLord*.png`). Visual direction is
**pixel / retro game aesthetic**.

## 2. Goals & non-goals

**Goals**
- Publish image-heavy blog posts written in Markdown with minimal friction.
- Fast, cheap, secure, low-maintenance site (static files only).
- Hands-off publishing: commit a post → it builds and deploys automatically.
- Distinct brand personality (pixel/retro) while keeping posts readable.

**Non-goals (out of scope for v1)**
- No comments / reader accounts.
- No on-site commerce or checkout (store stays on eBay).
- No web-based admin/CMS UI; authoring is file-based.
- No newsletter/email capture.
- No live eBay listing integration (store is a plain link).

## 3. Content model

Single content type: **blog post**. Authored as a Markdown file with front matter.

Proposed post front matter:
- `title` (required)
- `date` — publish date/time (required; drives ordering and scheduling)
- `tags` — list (required; e.g. `review`, `progress`, plus subject tags)
- `excerpt` / `description` — short summary for feed cards and meta tags (optional; auto-derived if omitted)
- `heroImage` / `thumbnail` — card + social-preview image (optional)
- `draft` — boolean; drafts are excluded from production builds

**Taxonomy:** tags only — one unified feed. "Reviews" vs "progress" are simply tags;
no separate sections or categories. A **tag picker sidebar** filters the feed.

**Images:** stored as files in the repo, co-located with (or near) their post.
Authored via a **drag-and-drop editor** (Obsidian or VS Code with a paste-image
extension) that copies the pasted/dragged image into the post's folder and inserts the
Markdown reference automatically. The build pipeline optimizes images (resize/compress,
modern formats, responsive `srcset`).

## 4. Information architecture & navigation

**Top bar navigation:**
- **Home** — blog feed
- **Store** — outbound link to the eBay store
  (`https://www.ebay.co.uk/usr/littlelordgames`), opens in a new tab
- Plus: **dark-mode toggle**, **search** entry point

Other pages/routes:
- Post detail page (one URL per post; clean slug)
- Tag pages / filtered feed (per-tag listing)
- Search results (client-side)
- RSS/Atom feed endpoint
- 404 page

## 5. Functional requirements

### 5.1 Home feed
- Lists posts in **published-date descending** order.
- **Excerpt cards**: each card shows title, date, thumbnail, tags, and a short excerpt,
  linking to the post's own full page.
- **Pagination at 10 posts per page** once the feed exceeds one page (numbered pages,
  not infinite scroll — better for SEO and static generation).

### 5.2 Post page
- Full rendered Markdown: headings, links, lists, code, blockquotes, and **images**
  (with captions, optimized/responsive).
- Title, publish date, and tag chips (linking to tag-filtered views).
- Open Graph / Twitter-card metadata for social link previews.

### 5.3 Tags
- Tag picker sidebar to filter the feed by one or more tags.
- Per-tag pages/views listing matching posts.

### 5.4 Search
- **Client-side full-text search** over all posts (required because there is no server
  runtime on the static host). Indexed at build time.

### 5.5 RSS / Atom feed
- Auto-generated feed of latest posts for subscribers/aggregators.

### 5.6 Drafts & scheduling
- Posts marked `draft` are excluded from production builds.
- Posts with a **future `date`** do not appear until that date. Because the site is
  static, a **daily GitHub Actions cron build** (in addition to build-on-push) publishes
  scheduled posts automatically within ~24h of their date.

### 5.7 Store link
- Top-bar "Store" link to the eBay store (`https://www.ebay.co.uk/usr/littlelordgames`),
  opening in a new tab. No on-site product display.

## 6. Non-functional requirements

- **Performance:** static HTML; optimized/responsive images; fast first load.
- **Responsive:** mobile-first layout, works on phone/tablet/desktop.
- **Theming:** pixel/retro aesthetic — pixel fonts and retro styling for **chrome**
  (header, nav, titles, tags, UI accents); a clean, **highly-readable font for post body
  text and captions** (image-heavy reviews must stay legible). **Light/dark mode toggle**
  with persisted preference. Palette derived from the brand logo (teal/mint creature).
- **Accessibility:** semantic HTML, alt text on images, sufficient contrast in both themes,
  keyboard-navigable.
- **SEO:** clean URLs, per-page titles/descriptions, Open Graph tags, sitemap.xml, RSS.
- **Privacy:** **GoatCounter** — privacy-friendly, cookieless, free for small sites; no
  cookie-consent banner required.
- **Security/maintenance:** no server-side code or DB to patch; minimal attack surface.

## 7. Authoring & publishing workflow

1. Author writes a Markdown post in Obsidian / VS Code; drags/pastes images, which are
   auto-saved into the post's asset folder with links inserted.
2. Commit and push to the **GitHub** repository.
3. **GitHub Actions** builds the static site (optimizing images, generating the search
   index, RSS, and sitemap) and **deploys to IIS via FTPS** to the server's web root.
4. Site is live; drafts/future-dated posts are excluded until eligible + rebuilt.

## 8. Hosting & deployment

Concrete details below are derived from the existing **pythia** project, which already
deploys to a subfolder of littlelordgames.com (`.github/workflows/deploy*.yml`). This
blog reuses the same host, web root, and FTPS mechanism.

- **Hosting:** IIS on **pronameserver** (shared Windows host). The blog is the **root
  site** of littlelordgames.com.
- **Repository:** GitHub (new repo, to be created).
- **CI/CD:** GitHub Actions — build on push to the main branch **plus a daily cron**
  (publishes scheduled posts), then deploy via FTPS.
- **Deploy mechanism / details (mirrors pythia):**
  - Action: `SamKirkland/FTP-Deploy-Action@v4.3.6`, `protocol: ftps`
  - `server: wsuk36.pronameserver.com`
  - Secrets (set once on the new repo): **`FTPS_USER`**, **`FTPS_PASS`**
  - **`server-dir: /littlelord/wwwroot/`** — the web root itself (pythia uses the
    `/littlelord/wwwroot/pythia/` subfolder; staging uses `/littlelord/wwwroot/rules_staging/`).
  - Base path is **`/`** (root), unlike pythia which bakes in a `/pythia` base path.
- **⚠ Critical caveat — don't delete sibling subfolders:** because the blog deploys to the
  shared web root that *contains* the `pythia/` and `rules_staging/` subfolders, the FTPS
  sync **must exclude** those (and any other sibling apps) so it doesn't wipe them. Use the
  action's `exclude` patterns (e.g. `pythia/**`, `rules_staging/**`) and a blog-specific
  `state-name` sync-state file. This must be verified before the first production deploy.
- **Build toolchain:** `actions/setup-node@v4`, **Node 24**, npm cache (matches pythia).
- **IIS config:** static-file serving with correct MIME types; a `web.config` for clean
  URLs/routing fallbacks, custom 404, and caching headers for static assets.
- **Domain:** littlelordgames.com — already live and hosted on pronameserver (confirmed via
  pythia's working deploy), so no new DNS setup needed for the root site.

## 9. Recommended technology stack

Owner expressed **no toolchain preference** and asked for a recommendation. Because output
is static, the build tool is independent of the IIS host.

**Recommended: [Astro](https://astro.build) (Node/JavaScript).**
- First-class Markdown/MDX content collections with typed front matter (clean fit for the
  post model, tags, drafts, and scheduling logic).
- Built-in image optimization (responsive `srcset`, modern formats) — directly addresses
  the image-flow concern.
- Easy, fully client-side search via **[Pagefind](https://pagefind.app)** (zero backend).
- Ships minimal JS; excellent performance; flexible theming for a bespoke pixel/retro look.
- Built-in RSS and sitemap integrations.

**Supporting choices:**
- **Search:** Pagefind (static index generated at build).
- **Analytics:** GoatCounter (cookieless script tag).
- **Images:** Astro's image pipeline / Sharp.
- **CI/CD:** GitHub Actions (Node 24) → `SamKirkland/FTP-Deploy-Action` over FTPS to IIS,
  reusing the pythia host/credential pattern.

_Alternatives considered: Eleventy (Node, lighter, more manual image setup); Hugo (Go,
fastest build but less flexible templating for bespoke design); Statiq (.NET, stays in the
MS ecosystem but smaller community/theme support). Any produces IIS-deployable static files._

## 10. Decisions log (from discovery interview)

| Topic | Decision |
|---|---|
| Architecture | Static site generator (no backend/DB) |
| Hosting | IIS — hard constraint |
| Authoring | File-based Markdown in git |
| Image flow | Drag-and-drop editor; images as repo files, build-optimized |
| Home feed | Excerpt cards linking to full post pages |
| Content org | Tags only, one unified feed |
| Store | Plain nav link to eBay |
| Design | Pixel / retro theme |
| Search | Client-side full-text |
| RSS | Yes |
| Dark mode | Yes (toggle) |
| Drafts/scheduling | Yes |
| Social previews | Yes (Open Graph) |
| Analytics | Privacy-friendly / cookieless |
| Comments | No |
| Newsletter | No |
| Repo host / CI | GitHub + GitHub Actions (build on push **+ daily cron**) |
| Toolchain | No preference → Astro recommended |
| Scheduled publishing | Daily cron build + build-on-push |
| Analytics product | GoatCounter (free, cookieless) |
| Deploy mechanism | FTPS to IIS web root (method-agnostic pipeline) |
| Theme depth | Pixel chrome + readable body font; palette from logo |
| Feed pagination | Numbered pages, 10 posts/page |

## 11. Resolved open items

- **Scheduled publishing:** ✅ Daily GitHub Actions cron build + build-on-push; future-dated
  posts go live within ~24h automatically.
- **Feed pagination:** ✅ Numbered pages, 10 posts per page.
- **Pixel/retro specifics:** ✅ Pixel styling for chrome (header/nav/titles/tags/UI),
  readable font for body text; palette derived from the brand logo. _Exact font files and
  hex palette to be chosen in the design step — direction is locked._
- **Analytics product:** ✅ GoatCounter.
- **Deploy mechanism:** ✅ FTPS via `SamKirkland/FTP-Deploy-Action` to
  `wsuk36.pronameserver.com`, `server-dir: /littlelord/wwwroot/` — reused from pythia.
- **eBay store URL:** ✅ `https://www.ebay.co.uk/usr/littlelordgames`.
- **Domain/host:** ✅ littlelordgames.com is live on pronameserver (proven by pythia's
  deploy); no new DNS work for the root site.
- **Expected post volume:** Assumed modest hobby cadence; pagination and the Pagefind
  search index both scale comfortably well beyond that — no constraint.

### Still needed before/while building
- **GitHub repo + secrets:** create the repo, then add **`FTPS_USER`** and **`FTPS_PASS`**
  secrets (same credentials pythia uses). _Owner will set these up once the repo exists._
- **Verify the sibling-folder exclusion** (`pythia/**`, `rules_staging/**`) in the deploy
  step before the first production push — see the ⚠ caveat in §8.
