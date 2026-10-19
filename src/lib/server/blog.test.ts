import { expect, it } from 'vitest';
import { findPosts } from './blog.ts';

it('filters localized content, paginates and omits article bodies from list payloads', () => {
  const result = findPosts(
    new URLSearchParams('q=LCP&tag=performance&sort=newest'),
    'de',
  );
  expect(result.total).toBeGreaterThan(0);
  for (const post of result.posts) {
    expect(post.tags).toContain('performance');
    expect(
      `${post.translations.de.title} ${post.translations.de.excerpt}`.toLowerCase(),
    ).toContain('lcp');
    expect(post.translations.de).not.toHaveProperty('body');
    expect(post.translations.en).not.toHaveProperty('body');
  }
  const page = findPosts(new URLSearchParams('page=2'), 'en');
  expect(page).toMatchObject({ page: 2, total: 20, pages: 4 });
  expect(page.posts).toHaveLength(6);
});
