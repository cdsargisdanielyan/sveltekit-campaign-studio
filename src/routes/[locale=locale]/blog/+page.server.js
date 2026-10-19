import { findPosts } from '#lib/server/blog.js';
import { localeSchema } from '#lib/contracts.js';
/** @type {import('./$types').PageServerLoad} */
export function load({ url, params }) {
  return {
    result: findPosts(url.searchParams, localeSchema.parse(params.locale)),
  };
}
