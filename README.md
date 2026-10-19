# Campaign Studio

A SvelteKit take-home implementation: bilingual public pages and an authenticated campaign workspace built from the supplied fixtures.

## Run

Requires **Node 24.x** and npm. Node's native TypeScript support runs the typed build and performance helpers; no separate script runner is needed.

```sh
npm ci
cp .env.example .env
npm run dev
```

Open `/en` or `/de`. For a production preview:

```sh
npm run build
npm run preview
```

Set `PUBLIC_SITE_URL` to the deployment's canonical origin before building, and use a random `SESSION_SECRET` of at least 32 characters. Without a local secret, a process-scoped random secret is used and restarting signs users out. Vercel deployments require an explicit secret.

## Demo accounts

All accounts use password **`demo1234`**.

| Account            | Access        |
| ------------------ | ------------- |
| `admin@demo.test`  | Read and edit |
| `editor@demo.test` | Read and edit |
| `viewer@demo.test` | Read only     |

## Checks

```sh
npm run lint
npm run check
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm run test:perf
npm run test:size
```

`check` runs strict TypeScript, unchecked-index checks, Svelte diagnostics and `tsc --noEmit`, including application code, tests and build helpers. ESLint rejects explicit `any` and TypeScript suppression comments. Only declarative tool configuration retains JavaScript/CommonJS where required by the tools.

Browser tests start a production preview with deterministic failure controls. Close an existing preview before running them. For manual failure testing, set `DEMO_FAILURES=true` and restart preview: the checkbox fails the next save, `?demo=load-error` tests a partial outage, and `?demo=slow` reveals the streamed skeleton. These controls default to off.

CI gates lint → types → units → production build → browser/axe/visual tests → Lighthouse navigation and interaction audits → initial JavaScript size. All three audited routes must score ≥95 in **every** Lighthouse category, with LCP <2s, CLS <0.1 and lab INP <200ms. Public initial JS is limited to 80 KB gzip; dashboard JS to 150 KB. A separate Linux job validates the actual Node/Edge deployment package.

## Architecture and decisions

- Zod is the single source of entity, session and API contracts; TypeScript types are inferred from schemas. Fixtures are validated on load. Post IDs, slugs and demo users retain their supplied shape.
- Public marketing and article pages are prerendered. Blog pagination and search use SSR with normalized, locale-aware canonical queries. Numbered pagination supports URLs, browser history and predictable crawling.
- Dashboard queries filter, sort and paginate on the server. A streamed promise returns only the selected campaign page. Mutations validate permissions and request origin, perform optimistic version checks, and invalidate only the campaign loader.
- Svelte runes hold page-local UI state; URLs hold navigation state. Save notices and focus restoration survive streamed table refreshes. No global user-specific client store is needed.
- Tailwind semantic tokens drive both themes. The custom dialog handles focus trapping, Escape, scroll locking and focus restoration. The campaign table supports keyboard sorting, filtering, pagination and editing.

See [architecture](docs/architecture.md), the [assessment checklist](docs/assessment.md), and [verification results](docs/verification.md).

## Deployment and limits

The Vercel build emits Node 24 application functions and an Edge `/api/og` route backed by forty localized, build-rendered PNGs. `scripts/package-edge.ts` uses Vercel's Build Output API because SvelteKit 3 removed the legacy per-route Edge adapter option. Local builds use the Node adapter; Windows symlink restrictions do not affect the Linux deployment build.

Import the repository into Vercel, select Node 24, configure `SESSION_SECRET` and `PUBLIC_SITE_URL`, and deploy with `npm run build`. Keep `DEMO_FAILURES=false`. Confirm login, an authenticated edit and `/api/og?slug=sub-second-lcp-on-a-content-site&locale=en` on the live origin.

Dashboard content is protected by server authentication and authorization, with private/no-store responses. It has complete metadata and no indexing blocks so the assessment's uniform SEO gate applies without exceptions. Anonymous crawlers receive the login redirect; neither `robots.txt` nor `noindex` is treated as access control. Login itself remains `noindex` and dashboard URLs are excluded from the public sitemap.

The explicitly permitted in-process mock API keeps edits for the life of one Node process. It is not durable, shared serverless storage. A real launch requires a database adapter with atomic version checks. Demo fixture passwords remain plaintext as supplied; they are checked only on the server. Session cookies are signed, HttpOnly, SameSite and expire after eight hours; logout clears the browser cookie without central revocation.

The production dependency audit reports no known vulnerabilities. Development-only Tailwind 3/Lighthouse tooling has inherited advisories; automated fixes propose incompatible majors or an obsolete Lighthouse CI downgrade, so they have not been force-applied. Marketing brand names are illustrative, not customer endorsements. Record actual development/review time when submitting; human review time is not invented by this repository.

The repository stays **private** until its owner approves public submission. A verified live URL and a green CI run on the final commit are required release checks.
