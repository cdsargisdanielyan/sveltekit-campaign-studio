import { redirect } from '@sveltejs/kit';
/** @type {import('./$types').RequestHandler} */
export async function POST({ cookies, request }) {
  const locale =
    (await request.formData()).get('locale') === 'de' ? 'de' : 'en';
  cookies.delete('session', { path: '/' });
  redirect(303, `/${locale}/login`);
}
