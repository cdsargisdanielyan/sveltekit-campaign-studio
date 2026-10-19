import { z } from 'zod';
import { channelSchema, statusSchema } from './contracts.ts';
import type { CampaignStatus, Channel, PostSearchResult } from './contracts.ts';

const pageSchema = z.coerce.number().int().min(1).max(100000).catch(1);
const sortSchema = z
  .enum([
    'name',
    'status',
    'channel',
    'owner',
    'budget',
    'spent',
    'ctr',
    'updatedAt',
  ])
  .catch('updatedAt');

export function readItemQuery(params: URLSearchParams) {
  return {
    page: pageSchema.parse(params.get('page') || 1),
    pageSize: 20,
    q: (params.get('q') || '').trim().slice(0, 100),
    statuses: params
      .getAll('status')
      .filter(
        (value): value is CampaignStatus =>
          statusSchema.safeParse(value).success,
      ),
    channels: params
      .getAll('channel')
      .filter(
        (value): value is Channel => channelSchema.safeParse(value).success,
      ),
    owner: params.get('owner') || '',
    sort: sortSchema.parse(params.get('sort')),
    direction: params.get('direction') === 'asc' ? 'asc' : 'desc',
  };
}
export type ItemQuery = ReturnType<typeof readItemQuery>;

export function postQueryString(
  query: Pick<PostSearchResult, 'q' | 'tag' | 'sort' | 'page'>,
): string {
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.tag) params.set('tag', query.tag);
  if (query.sort === 'oldest') params.set('sort', query.sort);
  if (query.page > 1) params.set('page', String(query.page));
  return params.size ? `?${params}` : '';
}

export function queryLink(
  url: { pathname: string; search: string },
  changes: Record<string, string | string[] | null>,
) {
  const params = new URLSearchParams(url.search);
  for (const [key, value] of Object.entries(changes)) {
    params.delete(key);
    for (const entry of Array.isArray(value) ? value : value ? [value] : [])
      params.append(key, entry);
  }
  return `${url.pathname}?${params}`;
}
