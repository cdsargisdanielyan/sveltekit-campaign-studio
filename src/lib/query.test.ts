import { describe, it, expect } from 'vitest';
import { readItemQuery, queryLink, postQueryString } from './query.ts';
import { selectItems } from './server/campaigns.ts';
import { initialItems } from './server/data.ts';
describe('campaign URL state', () => {
  it('keeps paginated and filtered public canonicals distinct without default query noise', () => {
    expect(postQueryString({ q: '', tag: '', sort: 'newest', page: 1 })).toBe(
      '',
    );
    expect(
      postQueryString({
        q: 'LCP',
        tag: 'performance',
        sort: 'oldest',
        page: 2,
      }),
    ).toBe('?q=LCP&tag=performance&sort=oldest&page=2');
  });
  it('normalizes malformed pages and unsupported sorting', () => {
    const state = readItemQuery(
      new URLSearchParams(
        'page=-5&sort=password&direction=invalid&status=active&status=bogus',
      ),
    );
    expect(state).toMatchObject({
      page: 1,
      sort: 'updatedAt',
      direction: 'desc',
      statuses: ['active'],
    });
  });
  it('preserves repeated facets and search while changing page', () => {
    const link = queryLink(
      new URL(
        'https://demo.test/en/dashboard/items?status=active&status=draft&q=summer',
      ),
      { page: '2' },
    );
    const params = new URL(link, 'https://demo.test').searchParams;
    expect(params.getAll('status')).toEqual(['active', 'draft']);
    expect(params.get('q')).toBe('summer');
    expect(params.get('page')).toBe('2');
  });
  it('applies OR within a facet and AND across facets before paginating', () => {
    const query = readItemQuery(
      new URLSearchParams(
        'status=active&status=draft&channel=email&sort=name&direction=asc',
      ),
    );
    const result = selectItems(initialItems, query);
    const expected = initialItems.filter(
      (row) =>
        ['active', 'draft'].includes(row.status) && row.channel === 'email',
    );
    expect(result.total).toBe(expected.length);
    expect(result.items.length).toBeLessThanOrEqual(20);
    expect(
      result.items.every(
        (row) =>
          ['active', 'draft'].includes(row.status) && row.channel === 'email',
      ),
    ).toBe(true);
  });
  it('clamps an out-of-range page and reports a real empty state', () => {
    const result = selectItems(
      initialItems,
      readItemQuery(new URLSearchParams('page=999&q=no-such-campaign')),
    );
    expect(result).toMatchObject({ items: [], total: 0, page: 1, pages: 1 });
  });
});
