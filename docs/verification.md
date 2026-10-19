# Verification record

Verified locally on 20 October 2026 with Node 24, Chromium 156, and the production build. These synthetic measurements describe this machine and scenario, not production field performance.

| Route                                       | Lighthouse performance (3 runs) | Accessibility | Best practices | SEO | LCP range   | CLS | Lab INP |
| ------------------------------------------- | ------------------------------- | ------------- | -------------- | --- | ----------- | --- | ------- |
| `/en`                                       | 100 / 100 / 99                  | 100           | 100            | 100 | 818–1102 ms | 0   | 38.0 ms |
| `/en/blog/sub-second-lcp-on-a-content-site` | 99 / 99 / 99                    | 100           | 100            | 100 | 762 ms      | 0   | 26.9 ms |
| `/en/dashboard/items`                       | 99 / 94 / 98                    | 100           | 100            | 100 | 884–985 ms  | 0   | 60.1 ms |

The performance gate uses the median run (100, 99 and 98 respectively), with the same ≥95 requirement for every route. One dashboard run scored 94; this variability is preserved here rather than hidden. Dashboard SEO has no audit exception.

The INP measurements use separate Lighthouse timespans with real browser input, mobile viewport, and four-times CPU slowdown. Navigation audits use simulated mobile throttling. Neither establishes field INP.

- Fifteen meaningful unit/component tests passed across seven files.
- Eight production-browser workflows passed, including real authentication, optimistic success/rollback, network recovery, viewer denial, locale navigation, API validation/origin/version enforcement, keyboard editing/focus restoration, partial failures and normal-browser shell-before-rows streaming.
- Dashboard axe checks found no serious or critical violations in either theme; the chart visual baseline passed.
- ESLint, Prettier, strict TypeScript and Svelte diagnostics passed with no errors or warnings.
- All seven route bundle checks passed: public routes 69.4–71.6 KB gzip, dashboard overview 69.9 KB and campaign table 76.8 KB.
- The Node production build passed on Windows.
- The TypeScript deployment packager and runtime-manifest verification passed locally, checking the Edge route and forty localized PNGs. The separate Linux CI job builds the complete Vercel package; packaging is not a live deployment.
- Desktop, mobile and dark-theme screenshots were visually reviewed. Login was also checked on an alternate localhost origin.

The GitHub repository is private, verified through the GitHub API. No visibility change is automated. A live hosted URL, final green quality workflow and submission-time visibility remain separate release checks. See the latest workflow on the repository's Actions tab for verification of the final pushed commit.
