import type { CampaignEdit, CampaignPage } from '../contracts.ts';
import type { ItemQuery } from '../query.ts';
import { error } from '@sveltejs/kit';
import { initialItems } from './data.ts';

// A process-local mock API. Replace this module with a persistent data adapter for real deployment.
const items = structuredClone(initialItems);

export function selectItems(
  source: typeof items,
  query: ItemQuery,
): CampaignPage {
  const filtered = source.filter(
    (item) =>
      item.name.toLowerCase().includes(query.q.toLowerCase()) &&
      (!query.statuses.length || query.statuses.includes(item.status)) &&
      (!query.channels.length || query.channels.includes(item.channel)) &&
      (!query.owner || item.owner.id === query.owner),
  );
  const direction = query.direction === 'asc' ? 1 : -1;
  filtered.sort((a, b) => {
    const left = query.sort === 'owner' ? a.owner.name : a[query.sort];
    const right = query.sort === 'owner' ? b.owner.name : b[query.sort];
    const comparison =
      typeof left === 'number' && typeof right === 'number'
        ? left - right
        : String(left).localeCompare(String(right), 'en');
    return direction * comparison || a.id.localeCompare(b.id);
  });
  const pages = Math.max(1, Math.ceil(filtered.length / query.pageSize));
  const page = Math.min(query.page, pages);
  return {
    items: filtered.slice((page - 1) * query.pageSize, page * query.pageSize),
    total: filtered.length,
    pages,
    page,
  };
}

export async function listItems(query: ItemQuery): Promise<CampaignPage> {
  return selectItems(items, query);
}
export function campaignSummary() {
  return {
    count: items.length,
    active: items.filter((item) => item.status === 'active').length,
    budget: items.reduce((sum, item) => sum + item.budget, 0),
    spent: items.reduce((sum, item) => sum + item.spent, 0),
  };
}
export function owners() {
  return [
    ...new Map(items.map((item) => [item.owner.id, item.owner])).values(),
  ];
}

export function updateItem(input: CampaignEdit) {
  const item = items.find((row) => row.id === input.id);
  if (!item) error(404, 'Campaign not found.');
  if (item.updatedAt !== input.updatedAt)
    error(409, 'This campaign changed. Refresh before editing again.');
  item.name = input.name;
  item.updatedAt = new Date(
    Math.max(Date.now(), Date.parse(item.updatedAt) + 1),
  ).toISOString();
  return structuredClone(item);
}
