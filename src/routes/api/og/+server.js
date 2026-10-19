import handler from '../../../../api/og.js';
/** @type {import('./$types').RequestHandler} */
export function GET({ request }) {
  return handler(request);
}
