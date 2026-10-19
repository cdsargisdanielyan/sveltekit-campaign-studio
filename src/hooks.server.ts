import type { Handle } from '@sveltejs/kit/hooks';
import { redirect } from '@sveltejs/kit';
import { readSession } from '#lib/server/auth.ts';

export const handle: Handle = async ({ event, resolve }) => {
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
  const streamedDashboard =
    event.route.id === '/[locale=locale]/dashboard/items';
  if (streamedDashboard) {
    // Compression buffers can hide the initial shell until the rows resolve.
    // Keep this small paginated HTML/data stream incremental end to end.
    response.headers.set('Content-Encoding', 'identity');
  }
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-Frame-Options', 'DENY');
  if (
    event.url.pathname.includes('/dashboard') ||
    event.url.pathname.includes('/login') ||
    event.url.pathname.includes('/api/')
  )
    response.headers.set(
      'Cache-Control',
      streamedDashboard
        ? 'private, no-store, no-transform'
        : 'private, no-store',
    );
  return response;
};
