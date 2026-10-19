# Assessment checklist

Mandatory requirements are mapped below; optional extras are not used to substitute for them.

| Requirement                                    | Implementation/evidence                                                                              |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Landing: hero, features, pricing, social proof | Localized marketing page; illustrative demo brand names disclosed                                    |
| Blog list, article, search, custom 404         | Localized routes, numbered pagination, Markdown renderer, real 404 status                            |
| URL round-trip search/filter/sort              | GET forms, repeated facets, query codec and browser history test                                     |
| Real login cookie; shared validation           | Zod login contract, server credential verification, signed HttpOnly session                          |
| Protected dashboard and authorization          | Server hook/layout, independent 401/403 endpoint enforcement                                         |
| Server table pagination/sorting/facets         | Campaign service over all 220 validated fixtures                                                     |
| Optimistic edit and rollback                   | Shared mutation contract, rejection/network recovery and stale-write tests                           |
| Streamed SSR and designed states               | Promise loader, immediate skeleton, empty/error/partial states; normal-browser chunk-order assertion |
| Deliberate rendering choices                   | Per-route table in architecture document                                                             |
| Edge and Node routes                           | Vercel Build Output API package and separate Linux runtime verification job                          |
| TypeScript everywhere                          | Typed app, Svelte scripts, tests and build helpers; strict `tsc`, index checks, ESLint bans          |
| Single-source API contracts                    | Zod entities/public user/page/mutation schemas and `z.infer` types                                   |
| Fixture boundaries and stable IDs              | Parsed JSON; supplied user shape, post IDs and slugs preserved                                       |
| Two locales, Intl and SEO alternates           | EN/DE dictionaries and content, locale routing, date/number formatting                               |
| Tokens, two themes, reusable primitives        | Semantic Tailwind/CSS variables, ten primitives and custom dialog                                    |
| Accessible composite and keyboard table        | Focus-trap unit tests, keyboard E2E, light/dark axe assertions                                       |
| Per-route SEO/social/structured data           | Shared SEO component, normalized canonicals, JSON-LD, sitemap/robots, localized OG PNGs              |
| Performance and JS budgets in CI               | Uniform four-category Lighthouse assertions, CWV/INP checks and per-route gzip budgets               |
| Unit/component tests                           | URL semantics, contracts, auth, stale writes, Markdown sanitization, composite focus behavior        |
| Anonymous/authenticated browser flows          | Discovery, real login, optimistic success/rollback, authorization and keyboard editing               |
| Visual regression                              | Deterministic chart baseline checked on Windows and Linux                                            |
| Formatting/lint/types/pre-commit               | ESLint, Prettier, Svelte checks, TypeScript and Husky/lint-staged                                    |
| RUM and client error reporting                 | Sampled web-vitals, sendBeacon, render/navigation error hooks, validated ingestion                   |
| README and defensible trade-offs               | Setup/demo credentials, architecture, verification and explicit mock-storage limits                  |

## Release checks

- Run the complete pipeline on the final pushed commit and retain its reports.
- Deploy to the owner's hosting account; verify authenticated edits, redirects, telemetry and Edge images on that live origin.
- Keep the repository private until the owner approves making it public for submission.
- Include the repository URL, verified live URL and actual development/review time in the submission. Human review time must be supplied honestly, not inferred from agent elapsed time.
