# Architecture

## Runtime and rendering boundaries

| Route                         | Rendering/runtime               | Reason                                               |
| ----------------------------- | ------------------------------- | ---------------------------------------------------- |
| `/`                           | Redirect to `/en`               | One default locale without duplicate content         |
| `/{locale}`                   | Prerendered                     | Stable marketing content and immediate HTML          |
| `/{locale}/blog`              | Node SSR                        | Numbered pagination with canonical page URLs         |
| `/{locale}/blog/{slug}`       | Prerendered                     | Forty known localized articles                       |
| `/{locale}/search`            | Node SSR                        | URL-based query, topic, ordering and pagination      |
| `/{locale}/login`             | Node SSR + enhanced form action | Server verification; works without client JS         |
| `/{locale}/dashboard`         | Node SSR                        | Request-local session and summary                    |
| `/{locale}/dashboard/items`   | Node streamed SSR               | Initial shell is independent of row availability     |
| `/api/items`                  | Node                            | Authorized, validated writes with version conflicts  |
| `/api/beacon`                 | Node                            | Same-origin, bounded telemetry ingestion             |
| `/api/og` on Vercel           | Edge                            | Small cached lookup of localized prerendered PNGs    |
| `/sitemap.xml`, `/robots.txt` | Prerendered                     | Deterministic public discovery metadata              |
| `/404`, unmatched paths       | SSR, HTTP 404                   | Custom error presentation without soft-404 responses |

SvelteKit 3's Vercel adapter targets Node. The packaging step adds a separate Edge function before its catch-all route using Vercel's Build Output API. OG rasterization happens during build, keeping the edge handler independent of Node crypto, auth and campaign data modules. Node keeps the mock service near its process-local data and supports the authentication dependencies. CI inspects the emitted runtimes and PNG files; a live deployment is verified separately.

## Data and contracts

`contracts.ts` defines schemas and inferred types. `server/data.ts` parses the supplied posts, campaigns, users and taxonomy at import. The mock service does filtering, stable sorting and pagination before serializing a page. OR applies within each status/channel facet; AND applies across facets. Invalid enum/query values normalize, page bounds clamp and equal sort values use stable ID ordering.

Post listing contracts omit article bodies from both translations. Article loaders render Markdown server-side and sanitize HTML before returning it; scripts, event handlers and unsafe URL schemes are removed. Search and pagination canonical URLs use normalized loader results instead of raw request parameters.

Reads belong in loaders; writes belong in the mutation endpoint. Authentication runs in a server hook and protected layout; the endpoint independently checks session, role, origin, input schema and version. No password or session secret enters a public loader result. Zod-derived public-user contracts strip password fields.

## Editing and streamed state

The campaign loader returns a promise with a discriminated success/failure result. Expected service failures preserve summaries and show a recoverable row error. The skeleton uses stable dimensions; no production delay is inserted for demonstration. Compression is disabled only on this small paginated stream so buffering cannot hide the first HTML chunk. Its responses are private, no-store and no-transform. The browser integration test checks chunk order without overriding request encoding.

An edit updates its row immediately, validates the response contract, rolls back rejected writes and refreshes only `campaigns:list`. One save is allowed at a time in a table. Save notices live above the streamed subtree so a fast refresh cannot erase feedback. Keyboard edit fields focus/select after bindings flush; cancellation and settled saves restore a sensible focus target. Version timestamps strictly increase even for same-millisecond writes; stale writes receive 409.

The source is an explicitly permitted in-process mock API. Per-process version checks are synchronous; no claim of distributed transactions or durable serverless persistence is made. A real backend must replace this module with shared storage and an atomic compare-and-update operation.

## UI and accessibility

Page-local runes and reactive collections manage interaction state. URL state is the durable navigation state; a global client store would duplicate it. Ten primitives serve repeated UI patterns, while the table and custom dialog own their domain-specific behavior. Semantic tokens in Tailwind reference CSS variables for themes; system fonts avoid font fetches and layout shifts.

The dialog traps Tab in both directions, supports Escape, labels its content, locks background scrolling and restores the trigger. The table uses native links, forms, selects and checkboxes; a named scroll region exposes wide columns to keyboard users. Axe runs in both themes, and an E2E flow exercises keyboard sorting, filtering, paging and editing. The visual fixture isolates exact chart geometry from platform font and fractional-position differences rather than accepting arbitrary image drift.

## SEO, performance and observability

Every content route supplies a title, description, canonical and social metadata. Localized content includes hreflang, Article/Organization/BreadcrumbList JSON-LD, a public sitemap and generated OG images. Login is noindex. Dashboard metadata remains complete and has no indexing blocks to meet the assessment's uniform SEO score; server authentication continues to protect every data request and mutation.

Lighthouse CI audits landing, article and authenticated campaigns three times with mobile throttling. All four categories are gated at 95. LCP, CLS and TBT have numeric gates. A separate real-interaction Lighthouse timespan enforces INP below 200ms; missing measurements fail rather than silently passing. Bundle checks traverse framework entries, layouts and route dependencies, compress each JS chunk once, and validate the generated manifest before using it.

`web-vitals` reports LCP/INP/CLS/TTFB from a 20% page-load sample through `sendBeacon`. Render boundaries and client navigation errors use the same endpoint without sampling. Payloads exclude query strings, credentials, stack traces and campaign contents; their schema and size are checked before logging. Synthetic lab INP is not presented as field certification.
