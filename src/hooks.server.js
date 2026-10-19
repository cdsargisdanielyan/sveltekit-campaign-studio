import { redirect } from '@sveltejs/kit';
import { readSession } from '#lib/server/auth.js';

/** @type {import('@sveltejs/kit/hooks').Handle} */
export async function handle({ event, resolve }) {
  event.locals.user = readSession(event.cookies.get('session'));
  const locale = event.url.pathname.split('/')[1] === 'de' ? 'de' : 'en';
  if (
    /^\/(en|de)\/dashboard(?:\/|$)/.test(event.url.pathname) &&
    !event.locals.user
  ) {
    redirect(
      303,
      `/${locale}/login?returnTo=${encodeURIComponent(event.url.pathname + event.url.search)}`,
    );
  }
  const response = await resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%lang%', locale),
  });
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Frame-Options', 'DENY');
  if (
    event.url.pathname.includes('/dashboard') ||
    event.url.pathname.includes('/login') ||
    event.url.pathname.includes('/api/')
  )
    response.headers.set('Cache-Control', 'private, no-store');
  return response;
}
