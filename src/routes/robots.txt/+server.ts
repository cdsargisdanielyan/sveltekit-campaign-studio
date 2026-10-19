import * as env from '$app/env/public';
export const prerender = true;
export function GET() {
  return new Response(
    `User-agent: *\nAllow: /\nDisallow: /api/\nSitemap: ${env.PUBLIC_SITE_URL || 'http://localhost:4173'}/sitemap.xml\n`,
    { headers: { 'Content-Type': 'text/plain' } },
  );
}
