import { report } from '#lib/telemetry.js';
/** @type {import('@sveltejs/kit/hooks').HandleClientError} */
export function handleError({ error }) {
  report({
    kind: 'error',
    name: 'client-navigation',
    message: error instanceof Error ? error.message : 'Navigation failed',
  });
  return { message: 'The page could not be loaded. Please try again.' };
}
