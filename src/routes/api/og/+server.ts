import type { RequestHandler } from './$types';
import handler from '../../../../api/og.ts';

export const GET: RequestHandler = ({ request }) => {
  return handler(request);
};
