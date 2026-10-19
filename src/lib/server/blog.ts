import { posts } from './data.ts';
import type { PostSearchResult } from '../contracts.ts';
import { postCardSchema } from '../contracts.ts';

export function findPosts(
  params: URLSearchParams,
  locale: 'en' | 'de',
): PostSearchResult {
  const q = (params.get('q') || '').trim().slice(0, 100);
  const tag = params.get('tag') || '';
  const sort = params.get('sort') === 'oldest' ? 'oldest' : 'newest';
  const requested = Number(params.get('page') || 1);
  const filtered = posts
    .filter(
      (post) =>
        (!tag || post.tags.includes(tag)) &&
        `${post.translations[locale].title} ${post.translations[locale].excerpt}`
          .toLowerCase()
          .includes(q.toLowerCase()),
    )
    .sort((a, b) =>
      sort === 'newest'
        ? b.publishedAt.localeCompare(a.publishedAt)
        : a.publishedAt.localeCompare(b.publishedAt),
    );
  const pages = Math.max(1, Math.ceil(filtered.length / 6));
  const page = Number.isSafeInteger(requested)
    ? Math.max(1, Math.min(requested, pages))
    : 1;
  return {
    posts: filtered
      .slice((page - 1) * 6, page * 6)
      .map((post) => postCardSchema.parse(post)),
    total: filtered.length,
    pages,
    page,
    q,
    tag,
    sort,
  };
}
