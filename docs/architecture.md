# Architecture and migration

## Flow

`src/data/mocks/*.json` → `src/lib/api/` → typed internal models → Astro pages and reusable components → static HTML.

`src/types/models.ts` defines Article, Team, Match, Standing, Category and Conference. Data-access functions return promises so an eventual network adapter does not change how page components obtain content. The repository contains no API-specific DTOs in its UI.

- `src/layouts/BaseLayout.astro`: document, global CSS, navigation, footer and SEO head.
- `src/layouts/ArticleLayout.astro`: reusable editorial article template, contents, sources and related stories.
- `src/components/news`: article cards and editorial sections.
- `src/components/soccer`: match cards and conference tables.
- `src/components/seo/SEOHead.astro` and `src/lib/seo`: centralized metadata, indexing checks and schema helpers.
- `src/pages`: SSG route generation and composition. `getStaticPaths` enumerates article and club slugs.

Original SVG images scale responsively without raster downloads; intrinsic dimensions reserve space. System fonts avoid font requests and font swapping. Only the mobile navigation and conference tabs ship application JavaScript. Tailwind is installed using its official Vite plugin; custom global tokens and editorial classes handle the publication’s typography and layout.

## Adapter contract

Keep the signatures of `getLatestArticles`, `getFeaturedArticles`, `getArticleBySlug`, `getArticlesByCategory`, `getTeams`, `getTeamBySlug`, `getUpcomingMatches`, `getRecentResults` and `getStandings`. Additional functions enumerate all articles, resolve team IDs and provide illustrative player profiles.

At each future adapter boundary:

1. Fetch external data server-side during the build; do not expose credentials to client scripts or `PUBLIC_` environment variables.
2. Validate external payloads and map provider IDs to stable internal IDs. Preserve URLs when titles change.
3. Normalize competition identifiers, UTC ISO timestamps, nullable scores, match status and conference labels.
4. Map licensed article content to structured, plain-text sections. Avoid rendering untrusted HTML; if a CMS requires rich HTML, introduce an explicit sanitizer.
5. Validate references between articles, teams, matches and standings. Handle provider errors explicitly, rather than silently showing fabricated fallback results.

## Directus / PostgreSQL

A future Directus schema can contain articles, authors, article_sections, teams, article_teams, fixtures and standings. Map Directus responses into the existing internal interfaces inside `src/lib/api`. PostgreSQL remains behind Directus; the static browser never connects to a database. Use a server-side read credential and published-only content filter. Trigger an Astro rebuild when verified content is published.

## Licensed sports and news providers

API-Football fixtures and teams should be mapped to internal stable team IDs; model statuses explicitly rather than inferring them from a date. Normalize timestamps before formatting U.S. Eastern Time. Map standings columns according to the provider’s competition rules. GNews or another licensed feed requires explicit publication rights, attribution and deduplication; a fetched title is not permission to republish an article body.

Python agents or n8n could later orchestrate ingestion and CMS workflows. They should publish into the validated editorial layer, not couple the frontend to their transport formats. None is implemented in this MVP.

## Production checklist

Replace all mock data with verified content, update both indexing guards, establish a real domain and branding, review source attribution and editorial authors, and enable indexing only after checking the emitted HTML and sitemap. Replace the included raster social card with an appropriate production image. Keep publication, editorial verification and deployment separate from this frontend prototype.
