import { z } from 'zod';
import { channelSchema, statusSchema } from './contracts.js';

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
/** @param {URLSearchParams} params */
export function readItemQuery(params) {
  return {
    page: pageSchema.parse(params.get('page') || 1),
    pageSize: 20,
    q: (params.get('q') || '').trim().slice(0, 100),
    statuses: params
      .getAll('status')
      .filter((value) => statusSchema.safeParse(value).success),
    channels: params
      .getAll('channel')
      .filter((value) => channelSchema.safeParse(value).success),
    owner: params.get('owner') || '',
    sort: sortSchema.parse(params.get('sort')),
    direction: params.get('direction') === 'asc' ? 'asc' : 'desc',
  };
}
/** @param {{pathname:string,search:string}} url @param {Record<string, string | string[] | null>} changes */
export function queryLink(url, changes) {
  const params = new URLSearchParams(url.search);
  for (const [key, value] of Object.entries(changes)) {
    params.delete(key);
    for (const entry of Array.isArray(value) ? value : value ? [value] : [])
      params.append(key, entry);
  }
  return `${url.pathname}?${params}`;
}
