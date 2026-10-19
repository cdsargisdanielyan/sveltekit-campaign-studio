import { posts } from './data.js';
/** @param {URLSearchParams} params @param {'en'|'de'} locale */
export function findPosts(params, locale) {
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
    posts: filtered.slice((page - 1) * 6, page * 6),
    total: filtered.length,
    pages,
    page,
    q,
    tag,
    sort,
  };
}
