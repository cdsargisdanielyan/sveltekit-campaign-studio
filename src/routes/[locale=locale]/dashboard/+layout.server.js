import { redirect } from '@sveltejs/kit';
/** @type {import('./$types').LayoutServerLoad} */
export function load({ locals, params }) {
  if (!locals.user) redirect(303, `/${params.locale}/login`);
  return { user: locals.user };
}
