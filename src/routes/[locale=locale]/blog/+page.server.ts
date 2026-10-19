import type { PageServerLoad } from './$types';
import { findPosts } from '#lib/server/blog.ts';
import { localeSchema } from '#lib/contracts.ts';
import { postQueryString } from '#lib/query.ts';

export const load: PageServerLoad = ({ url, params }) => {
  const result = findPosts(url.searchParams, localeSchema.parse(params.locale));
  return { result, canonicalQuery: postQueryString(result) };
};
