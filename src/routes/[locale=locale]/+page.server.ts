import { initialItems } from '#lib/server/data.ts';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = () => ({
  campaignCount: initialItems.length,
});
