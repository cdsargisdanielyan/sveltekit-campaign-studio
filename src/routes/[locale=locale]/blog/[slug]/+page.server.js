import { error } from '@sveltejs/kit';
import { posts } from '#lib/server/data.js';
import { localeSchema } from '#lib/contracts.js';
export const prerender = true;
export function entries() {
  return posts.flatMap((post) =>
    localeSchema.options.map((locale) => ({ locale, slug: post.slug })),
  );
}
/** @type {import('./$types').PageServerLoad} */
export function load({ params }) {
  const post = posts.find((post) => post.slug === params.slug);
  if (!post) error(404, 'Post not found.');
  return { post };
}
