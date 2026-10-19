import { posts } from '#lib/server/data.js';
import * as env from '$app/env/public';
export const prerender = true;
export function GET() {
  const origin = env.PUBLIC_SITE_URL || 'http://localhost:4173';
  const paths = ['', '/blog', ...posts.map((post) => `/blog/${post.slug}`)];
  const xml = paths
    .flatMap((path) =>
      ['en', 'de'].map(
        (locale) =>
          `<url><loc>${origin}/${locale}${path}</loc>${['en', 'de'].map((other) => `<xhtml:link rel="alternate" hreflang="${other}" href="${origin}/${other}${path}"/>`).join('')}</url>`,
      ),
    )
    .join('');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${xml}</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
}
