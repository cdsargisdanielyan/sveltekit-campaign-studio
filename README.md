# Campaign Studio

A SvelteKit assessment implementation with a bilingual public journal and an authenticated campaign workspace. Uses the supplied fixtures without changing post IDs, slugs, or user records.

## Run locally

Requires Node **22.17+** (Node 24 recommended) and npm. No database or third-party service is required.

```sh
npm ci
cp .env.example .env
npm run dev
```

Set `SESSION_SECRET` to a random string of at least 32 characters for deployment. Local development falls back to a process-scoped random secret; restarting the server signs everyone out. Set `PUBLIC_SITE_URL` to the canonical deployment origin before building.

```sh
npm run build
npm run preview
```

Open `/en` or `/de`. The root redirects to `/en`; legacy unlocalized content routes are intentionally not duplicated.

## Demo accounts

All accounts use `demo1234`.

| Account            | Access        |
| ------------------ | ------------- |
| `admin@demo.test`  | Read and edit |
| `editor@demo.test` | Read and edit |
| `viewer@demo.test` | Read only     |

## Validation

```sh
npm run lint
npm run check
npm test
npx playwright install chromium
npm run test:e2e
npm run test:perf
npm run test:size
```

The last three commands require a production build. Playwright starts its own preview server and enables deterministic failure demonstrations. Set `DEMO_FAILURES=true` and restart preview to manually test the “Fail next save” checkbox. `?demo=load-error` on the campaign route shows a partial service failure while preserving its summary. These controls are disabled by default.

The implementation is **JavaScript**, as requested by the repository owner, despite the assessment asking for TypeScript. Zod provides runtime contracts; JSDoc derives types from those contracts. `svelte-check` and `tsc --noEmit` check JavaScript in strict mode. `src/app.d.ts` contains only the framework's ambient locals declaration.

## Structure

- `src/lib/contracts.js`: entity and request schemas, shared login validation.
- `src/lib/server`: validated fixtures, mock campaign service, post queries, signed sessions.
- `src/lib/components`: semantic primitives, the custom focus-trapping dialog, and campaign table.
- `src/routes`: read loaders, mutation endpoint, localized pages and metadata.
- `scripts`: performance authentication, route bundle budgets, Vercel Edge packaging.
- `tests`: browser workflows, authorization, accessibility and visual regression.

Loaders select and paginate data on the server. The browser receives only the selected campaign page. Repeated `status` and `channel` parameters implement OR within a facet and AND between facets; search, owner, sorting and pagination live in the URL. Invalid values normalize to safe defaults and pages clamp to available results.

The campaign loader returns an unresolved rows promise. Its lightweight shell and fixed-height skeleton can render before the table; expected service errors resolve to an explicit failure state. The mock service is fast, so production does not add artificial latency just to make a skeleton visible.

Editing submits a shared Zod contract to a PATCH endpoint. Optimistic values are tracked per row. Failed writes restore the prior value; saved timestamps detect stale writes with 409. Only the campaign loader is invalidated. 401, 403, validation, conflict and network/service errors have distinct messages.

State uses Svelte 5 runes and a reactive set for local pending writes. URL state stays outside client stores. Server data is never placed in a shared user-specific global store.

## Rendering and deployment

| Route                       | Rendering             | Rationale                                                   |
| --------------------------- | --------------------- | ----------------------------------------------------------- |
| `/{locale}`                 | Prerendered           | Static marketing content; predictable first paint           |
| `/{locale}/blog`            | SSR                   | Real pagination through URL query parameters                |
| `/{locale}/blog/{slug}`     | Prerendered           | Forty known localized article pages                         |
| `/{locale}/search`          | SSR                   | Shareable filters and crawlable result HTML                 |
| `/{locale}/login`           | SSR + enhanced action | Shared validation; works without client JavaScript          |
| `/{locale}/dashboard`       | Node SSR              | Server-side session boundary and summary                    |
| `/{locale}/dashboard/items` | Node streamed SSR     | Immediate shell; independent row state                      |
| `/api/items`, `/api/beacon` | Node                  | Mutations and observability at server boundaries            |
| `/api/og` on Vercel         | Edge                  | Lightweight cached lookup of build-generated localized PNGs |

Vercel deployment uses its Node 24 adapter. SvelteKit 3 no longer supports the old per-route Edge adapter flag, so `scripts/package-edge.js` adds a separate Edge function through Vercel's Build Output API after the adapter completes. It renders forty OG PNGs at build time and installs an Edge route before the Node catch-all. Locally, `/api/og` renders the same post metadata using the Node fallback. Edge avoids loading the authentication and campaign modules; Node is appropriate for the crypto-backed auth and mock data service. This is a configured runtime split, not a claim of a verified deployed URL.

Local builds use the Node adapter. Windows cannot always create the symlinks required by the Vercel adapter; deploy Vercel from its Linux builder or CI.

Import this **private** GitHub repository into Vercel, select Node 24, set `SESSION_SECRET` and `PUBLIC_SITE_URL`, then deploy with `npm run build`. Keep `DEMO_FAILURES=false`. Repository visibility remains private until the owner approves making it public for submission.

## Design and accessibility

Semantic Tailwind tokens reference CSS variables for both themes; the theme is applied before paint and saved locally. System fonts avoid font network requests and layout shifts. Ten primitives support the public surface and workspace. The custom dialog implements focus entry, trapping, Escape dismissal, scroll locking and restoration without a component library.

Links use origin-root paths because subpath deployment is not supported. The wide table is a named, focusable scroll region so keyboard users can scroll all columns. Sorting, facets, paging and editing use native keyboard-operable elements. Locale switching preserves query state and updates the document language.

SEO includes per-locale canonicals and alternates, Article/Organization/BreadcrumbList JSON-LD, build-generated sitemap and robots entries, and localized OG metadata. Provided article bodies contain plain paragraph copy; they are rendered as escaped text rather than introducing a Markdown dependency for unused syntax. Placeholder German fixture copy is preserved.

## Tests and budgets

Unit tests cover query normalization, facet semantics, pagination, shared validation and dialog focus behavior. Browser tests cover anonymous discovery, save/persistence/rollback, server-side viewer denial, authentication redirects and 404 status. Axe rejects serious/critical dashboard violations. The visual baseline targets the chart component, avoiding OS-specific font rasterization noise.

CI runs lint → checked JavaScript → unit tests → build → Playwright → Lighthouse → bundle budget. Lighthouse uses mobile emulation and four-times CPU slowdown with three runs. Gates require performance/accessibility/best-practices ≥95, LCP <2 seconds, CLS <0.1 and TBT ≤200ms. Public pages also require SEO ≥95. Dashboard pages intentionally use `noindex`: requiring a public-indexability score there would conflict with the authentication boundary. This is a documented deviation from the literal all-routes SEO score requirement.

Lighthouse navigation audits do **not** measure INP. A separate Lighthouse timespan script exercises theme changes and the dashboard dialog under mobile emulation with four-times CPU slowdown; it requires a measured INP below 200ms on all three target routes and fails if a measurement is unavailable. These are synthetic interaction measurements, not field certification. Real INP, LCP, CLS and TTFB are collected with `web-vitals` in a 20% page-load sample and sent through `sendBeacon` to a bounded, same-origin schema-validated endpoint. Error boundaries and client navigation errors use the same reporting path without sampling. The demo endpoint logs metrics; it is not an analytics database.

The route-size script walks the production manifest's static dependencies and counts each compressed JavaScript chunk once, including the framework entry and layout chain. Public pages must stay ≤80 KB gzip; dashboard pages ≤150 KB.

## Deliberate limits

- The provided JSON is a mock backend. Campaign changes persist within one Node process and reset on restart; serverless instances do not share them. A real launch needs a database adapter with atomic version checks. This assessment does not pretend that process memory is durable storage.
- Demo users intentionally use the supplied plaintext fixture passwords, verified only on the server. Signed HttpOnly, SameSite cookies expire after eight hours; logout clears the browser cookie but there is no central token revocation service.
- The production dependency audit reports no known vulnerabilities. The full audit reports advisories in development-only Tailwind 3 and Lighthouse tooling; automatic fixes propose incompatible major changes (and an obsolete Lighthouse CI downgrade). They have not been force-applied. Run `npm audit` when maintaining the toolchain; its dependencies are not shipped in the production client.
- The marketing logos are illustrative demo names, not customer endorsements. Pricing describes this free demo; there is no checkout or unrequested campaign-creation workflow.
- Live deployment and a green remote CI run must be verified before submission. Local verification alone does not establish either.
- Keep an honest record of human review and deployment time when submitting. No time estimate is fabricated by the implementation.
