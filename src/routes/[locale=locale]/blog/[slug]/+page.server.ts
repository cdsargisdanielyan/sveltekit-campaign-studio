import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { posts } from '#lib/server/data.ts';
import { renderArticle } from '#lib/server/markdown.ts';
import { localeSchema, postCardSchema } from '#lib/contracts.ts';
export const prerender = true;
export function entries() {
  return posts.flatMap((post) =>
    localeSchema.options.map((locale) => ({ locale, slug: post.slug })),
  );
}

export const load: PageServerLoad = ({ params }) => {
  const post = posts.find((post) => post.slug === params.slug);
  if (!post) error(404, 'Post not found.');
  return {
    post: postCardSchema.parse(post),
    bodyHtml: renderArticle(post.translations[params.locale].body),
  };
};
