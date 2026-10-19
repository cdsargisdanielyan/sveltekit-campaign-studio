import { redirect } from '@sveltejs/kit';
/** @type {import('./$types').RequestHandler} */
export function POST({ cookies }) {
  cookies.delete('session', { path: '/' });
  redirect(303, '/en/login');
}
