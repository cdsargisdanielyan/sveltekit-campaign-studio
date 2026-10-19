import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = ({ locals, params }) => {
  if (!locals.user) redirect(303, `/${params.locale}/login`);
  return { user: locals.user };
};
