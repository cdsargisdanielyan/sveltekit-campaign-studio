import type { RequestHandler } from './$types';
import { metricSchema } from '#lib/contracts.ts';

export const POST: RequestHandler = async ({ request, url }) => {
  if (request.headers.get('origin') !== url.origin)
    return new Response(null, { status: 403 });
  if (Number(request.headers.get('content-length') || 0) > 4096)
    return new Response(null, { status: 413 });
  const text = await request.text();
  if (text.length > 4096) return new Response(null, { status: 413 });
  let value;
  try {
    value = JSON.parse(text);
  } catch {
    return new Response(null, { status: 400 });
  }
  const parsed = metricSchema.safeParse(value);
  if (!parsed.success) return new Response(null, { status: 400 });
  console.info('[rum]', parsed.data);
  return new Response(null, { status: 204 });
};
