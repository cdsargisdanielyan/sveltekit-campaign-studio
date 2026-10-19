# Verification record

Verified locally on 20 October 2026 with Node 24, Chromium 156, and the production build. These synthetic measurements describe this machine and scenario, not production field performance.

| Route                                       | Lighthouse performance (3 runs) | Accessibility | Best practices | SEO                        | LCP range   | CLS | Lab INP |
| ------------------------------------------- | ------------------------------- | ------------- | -------------- | -------------------------- | ----------- | --- | ------- |
| `/en`                                       | 100 / 100 / 100                 | 100           | 100            | 100                        | 826–1118 ms | 0   | 43 ms   |
| `/en/blog/sub-second-lcp-on-a-content-site` | 99 / 100 / 100                  | 100           | 100            | 100                        | 704–767 ms  | 0   | 43 ms   |
| `/en/dashboard/items`                       | 96 / 100 / 98                   | 100           | 100            | 66 (intentional `noindex`) | 839–870 ms  | 0   | 62 ms   |

The INP measurements use separate Lighthouse timespans with real browser input, mobile viewport, and four-times CPU slowdown. Navigation audits use simulated mobile throttling. Neither establishes field INP.

- Seven meaningful unit/component tests passed.
- Six production-browser workflows passed, including real authentication, optimistic rollback, viewer denial, locale navigation, partial failures, and uncompressed shell-before-rows streaming.
- Dashboard axe checks found no serious or critical violations.
- ESLint, Prettier, svelte-check and checked-JavaScript `tsc --noEmit` passed; Svelte diagnostics had no warnings.
- All seven route bundle checks passed: approximately 69–71 KB gzip for public pages and 76 KB for the campaign table.
- The Node production build passed on Windows.
- The Vercel Linux build and deployment-manifest verification passed in GitHub Actions for commit `8207064`. This validates Node/Edge packaging and forty localized PNGs, not a live deployment.
- Desktop, mobile and dark-theme screenshots were visually reviewed. Login was also checked on an alternate localhost origin.

The GitHub repository is private, verified through the GitHub API. No visibility change is automated. A live hosted URL, final green quality workflow and submission-time visibility remain separate release checks.
