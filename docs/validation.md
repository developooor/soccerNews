# Validation evidence

Validated in the cloud workspace on October 14, 2026, with Node 24.19, npm 11.9, Astro 7.3.8 and system Chromium.

| Check                                       | Outcome                                                                                                                 |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Repeated installation (`npm ci`)            | Passed; reusable installer executed                                                                                     |
| Astro / strict TypeScript (`npm run check`) | 0 errors, 0 warnings, 0 hints                                                                                           |
| Production static build                     | 42 HTML pages including custom 404                                                                                      |
| Fixture validation                          | 20 news articles + 5 guides, 10 teams, 20 matches, 10 standings rows; relationships and table arithmetic passed         |
| Generated HTML / links                      | 1,033 internal links and anchors passed; one H1 per page; unique titles and descriptions; JSON-LD parsed                |
| Demo indexing guard                         | Noindex and blocked robots; no demo sitemap. Enabling both indexing environment flags still leaves demo content blocked |
| Browser checks                              | 8 representative routes × 3 widths (375 / 768 / 1440); loaded images, no page overflow or JS errors                     |
| Interactions                                | Mobile navigation opening / Escape / link navigation; both conference tabs; arrow-key navigation passed                 |
| Automated accessibility                     | No axe WCAG 2 A/AA or WCAG 2.1 A/AA violations on the 24 page/viewport cases                                            |
| Startup                                     | Development and production preview each returned HTTP 200 and expected demo content for home and article detail         |

## Lighthouse mobile laboratory measurements

| Page           | Performance | Accessibility | Best practices | SEO |
| -------------- | ----------- | ------------- | -------------- | --- |
| Home           | 100         | 100           | 100            | 69  |
| Sample article | 100         | 100           | 100            | 69  |

The SEO audit is reduced by the deliberate indexing block. The demo must retain `noindex, nofollow`; the 90+ SEO target is not met in this demo mode. Lighthouse can also report render-blocking CSS recommendations despite a 100 performance score. Local laboratory scores can change with host load and do not establish field Core Web Vitals. Axe and Lighthouse do not replace a comprehensive manual accessibility review.

The latest reproducible screenshots, accessibility JSON and Lighthouse HTML reports are retained in ignored `test-results/`. Run the documented audit commands to regenerate them; these results are not presented as measurements of a published deployment.

No real API, database, CMS, authentication, mail delivery, provider rights, or external production deployment was tested; none is implemented in this MVP.
