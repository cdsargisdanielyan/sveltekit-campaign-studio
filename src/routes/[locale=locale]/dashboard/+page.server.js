import { campaignSummary } from '#lib/server/campaigns.js';
export function load() {
  return { summary: campaignSummary() };
}
