/**
 * Site-wide configuration. Single source of truth for metadata, the outbound
 * store link, analytics, and feed paging. Imported across layouts/pages.
 */
export const SITE = {
  title: 'LittleLordGames',
  /** Used for default meta description / OG when a page supplies none. */
  description:
    'Product reviews and hobby progress updates from LittleLordGames — served as fast static pages.',
  /** Canonical origin; mirror of `site` in astro.config.mjs. */
  url: 'https://littlelordgames.com',
  /** Outbound eBay store (opens in a new tab). No on-site commerce. */
  ebayStoreUrl: 'https://www.ebay.co.uk/usr/littlelordgames',
  /**
   * GoatCounter site code for cookieless analytics. Leave empty to emit no
   * script. Set to your code (the `<code>` in `<code>.goatcounter.com`) to enable.
   */
  goatCounterCode: '<script data-goatcounter="https://littlelordgames.goatcounter.com/count" async src="//gc.zgo.at/count.js"></script>',
  /** Numbered pagination size for the home + tag feeds. */
  postsPerPage: 10,
  /** Default social-preview image (in /public), used when a post has no hero. */
  defaultOgImage: '/og-default.png',
  author: 'LittleLordGames',
  locale: 'en_GB',
} as const;
