import { campaignSummary } from '#lib/server/campaigns.ts';
export function load() {
  return { summary: campaignSummary() };
}
