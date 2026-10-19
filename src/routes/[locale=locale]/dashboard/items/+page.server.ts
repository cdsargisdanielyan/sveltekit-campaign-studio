import type { PageServerLoad } from './$types';
import { listItems, owners, campaignSummary } from '#lib/server/campaigns.ts';
import { readItemQuery } from '#lib/query.ts';
import * as env from '$app/env/private';

export const load: PageServerLoad = ({ url, depends }) => {
  depends('campaigns:list');
  const query = readItemQuery(url.searchParams);
  // Catch on the server before streaming: expected errors become a typed UI state,
  // avoiding unhandled rejections before SvelteKit attaches its stream handler.
  const rows = (async () => {
    if (
      env.DEMO_FAILURES === 'true' &&
      url.searchParams.get('demo') === 'slow'
    ) {
      await new Promise((resolve) => setTimeout(resolve, 600));
    }
    if (
      env.DEMO_FAILURES === 'true' &&
      url.searchParams.get('demo') === 'load-error'
    )
      return {
        ok: false,
        message: 'Campaign service is temporarily unavailable.',
      };
    try {
      return { ok: true, data: await listItems(query) };
    } catch {
      return {
        ok: false,
        message: 'Campaign service is temporarily unavailable.',
      };
    }
  })();
  return {
    query,
    rows,
    owners: owners(),
    summary: campaignSummary(),
    demoFailures: env.DEMO_FAILURES === 'true',
  };
};
