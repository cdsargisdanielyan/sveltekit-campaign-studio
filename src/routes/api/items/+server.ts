import type { RequestHandler } from './$types';
import { error, json } from '@sveltejs/kit';
import { editSchema } from '#lib/contracts.ts';
import type { CampaignEditResponse } from '#lib/contracts.ts';
import { updateItem } from '#lib/server/campaigns.ts';
import * as env from '$app/env/private';

export const PATCH: RequestHandler = async ({ request, locals, url }) => {
  if (!locals.user) error(401, 'Sign in again to save changes.');
  if (locals.user.role === 'viewer')
    error(403, 'Your account has read-only access.');
  if (request.headers.get('origin') !== url.origin)
    error(403, 'Invalid request origin.');
  const parsed = editSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success)
    return json(
      { message: 'Use a campaign name between 3 and 100 characters.' },
      { status: 422 },
    );
  if (
    env.DEMO_FAILURES === 'true' &&
    request.headers.get('x-demo-failure') === 'true'
  )
    error(503, 'Demo service failure. Your original value has been restored.');
  return json({ item: updateItem(parsed.data) } satisfies CampaignEditResponse);
};
