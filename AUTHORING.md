# Writing posts

This blog is authored in Markdown. Each post is a **folder** under
`src/content/blog/` containing an `index.md` and its images. The folder name is
the post's URL slug.

```
src/content/blog/
└─ my-great-review/        ← becomes /blog/my-great-review/
   ├─ index.md
   └─ sprue.jpg            ← drag/paste images in here
```

## 1. Create a post

1. Make a new folder under `src/content/blog/` named with the URL slug you want
   (lowercase, hyphens — e.g. `necromunda-terrain`).
2. Add an `index.md` with front matter:

```markdown
---
title: My Great Review
date: 2026-06-15
tags:
  - review
  - necromunda
excerpt: A one-line summary for cards, search, and social previews.
heroImage: ./hero.jpg
heroAlt: Painted gang models on a board.
draft: false
---

Write the post body here in **Markdown**.
```

## 2. Front matter reference

| Field       | Required | Notes                                                            |
| ----------- | -------- | ---------------------------------------------------------------- |
| `title`     | ✅       | Post title.                                                      |
| `date`      | ✅       | Publish date/time. Drives ordering **and** scheduling.           |
| `tags`      | ✅       | One or more tags. Reviews and progress logs share one feed.      |
| `excerpt`   |          | Short summary. Auto-derived from the body if omitted.            |
| `heroImage` |          | Card + social-preview image. Path relative to the post folder.   |
| `heroAlt`   |          | Alt text for the hero image (accessibility).                     |
| `draft`     |          | `true` hides the post from production builds. Defaults to false. |

## 3. Images

- **Drag or paste** images straight into the post folder (Obsidian, or VS Code
  with a paste-image extension). Reference them with a **relative path**:
  `![A painted model](model.jpg)`.
- Relative images are automatically resized, compressed, and served as
  responsive WebP — no manual optimization needed.
- **Captions:** add a title in quotes and it renders as a caption under the
  image:

  ```markdown
  ![Squad of troopers](squad.jpg 'My first finished squad.')
  ```

## 4. Tags

There are no categories — just tags. Use `review` and `progress` as the primary
kind, plus subject tags (game name, faction, etc.). Tag pages live at
`/tags/<tag>/` and a tag sidebar filters the feed.

## 5. Drafts & scheduling

- **Draft:** set `draft: true` to keep a post out of production. It still shows
  in local `npm run dev` so you can preview it.
- **Schedule:** set a **future `date`**. The post stays hidden until then; a
  daily build publishes it automatically within ~24h. (You can also just push
  again on/after the date to publish immediately.)

## 6. Preview locally

```bash
npm install      # first time only
npm run dev      # http://localhost:4321 — shows drafts + scheduled posts
npm run build    # production build (excludes drafts/future posts)
npm run preview  # serve the production build locally
```

## 7. Publish

Commit and push to the canonical branch. GitHub Actions builds the site
(optimizing images, generating the search index, RSS, and sitemap) and deploys
it over FTPS. Your post is live once the workflow finishes.

```bash
git add .
git commit -m "Add Necromunda terrain review"
git push
```
