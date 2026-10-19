import type { RequestHandler } from './$types';
import handler from '#lib/server/og.ts';

export const GET: RequestHandler = ({ request }) => {
  return handler(request);
};
