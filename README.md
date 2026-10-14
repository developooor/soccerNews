# Soccer USA News

A complete English-language American soccer publication demo built with Astro 7, strict TypeScript, Tailwind CSS 4 (official Vite plugin), and tree-shaken Lucide Astro icons. Static generation; no React, live APIs, CMS, database, authentication, email capture, or AI integration.

## Run

Node **22.12+** (validated with 24.19), npm 9.6+.

```bash
npm install
npm run dev
npm run build
npm run preview
```

Astro 7 starts managed background servers. Stop a server you started with `ASTRO_TELEMETRY_DISABLED=1 npx astro dev stop` or `ASTRO_TELEMETRY_DISABLED=1 npx astro preview stop`. Use `npm run preview -- --port 4322` and `TEST_BASE_URL=http://localhost:4322` for browser audits while development runs on 4321.

For reproducible cloud installation, use `npm ci`. The checked-in lockfile pins dependencies. `.npmrc` puts npm's cache in `/tmp/soccer-npm` for this cloud machine; adjust its path if needed locally. Astro telemetry is disabled in package scripts, avoiding writes to an unavailable home directory. The development server listens on port 4321 by default.

## Included

- Home, MLS, USMNT, standings, schedule, guides, 10 individual club pages, 25 article detail pages and a custom 404.
- 20 news articles (including 5 USMNT articles), 5 evergreen guides, 10 MLS teams, 20 simulated matches, and two five-team conference tables.
- Original local SVG editorial illustrations: no external image requests or proprietary club badges.
- Mobile navigation, keyboard-operable conference tabs, semantic tables, article contents navigation, source links and sharing links.
- Unique metadata, canonical URLs, Open Graph / X cards, Organization, WebSite, Article / NewsArticle, SportsTeam and breadcrumb JSON-LD.
- A newsletter placeholder explicitly marked coming soon; it collects no data.

## Demo and indexing safety

All simulated scenarios, match dates, scores, player profiles and standings are labeled demo content. Official external links are background references, not evidence for fictional scenarios. Actual clubs are named for demonstration; this site implies no affiliation.

Copy `.env.example` to `.env` only if you need custom settings. Set `SITE_URL` to your eventual domain before deployment; the default is the reserved placeholder `https://soccer-usa-news.example`. Settings are read at **build time**.

Default: `ENABLE_INDEXING=false`, `CONTENT_MODE=demo`, `noindex, nofollow`, and `robots.txt` disallows crawling. The official Astro sitemap integration is configured but emits no sitemap while all URLs contain demo content; its “No pages found” warning is expected.

Indexing requires **both** `ENABLE_INDEXING=true` and `CONTENT_MODE=verified`, plus removal of all demo flags through verified replacement content. Merely switching the environment flags cannot index the included fictional dataset. When replacing the adapter, update the shared `hasDemoContent` check and the build-time sitemap guard together. Never relabel fictional content as verified to bypass the guard. Replace the demo notice, author identity, sources and illustration captions with accurate production content as part of that migration.

## Validation

```bash
npm run check
npm run build
npm test
# In another terminal, run npm run preview, then:
npm run test:browser
npm run audit:lighthouse
```

`npm test` checks fixture counts and relationships, standings arithmetic, all generated pages, internal links and anchors, unique SEO metadata, structured-data syntax, image dimensions, one H1 per page, and demo indexing protections. It requires a current demo build in `dist`.

Browser tests use an installed Chromium (`CHROMIUM_PATH`, default `/usr/bin/chromium`). They exercise 8 representative routes at 375, 768 and 1440 pixels, mobile menu behavior, conference tab keyboard interaction, image loading, horizontal overflow, JavaScript errors, and axe WCAG A/AA checks. `TEST_BASE_URL` can override the test server address. Screenshots and Lighthouse reports are written to ignored `test-results/`.

Lighthouse is measured using its default mobile simulation on the home and article pages. SEO scores are intentionally affected by the required `noindex` safeguard. These are local lab measurements, not field Core Web Vitals or a guarantee for a future deployment. See [validation evidence](docs/validation.md).

## Architecture

See [architecture and future integrations](docs/architecture.md). Page components consume asynchronous internal data-access functions, never raw JSON fixtures. Replace adapter implementations to integrate a CMS or licensed feed while preserving the component models.
