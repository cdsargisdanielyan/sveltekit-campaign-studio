import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies, request }) => {
  const locale =
    (await request.formData()).get('locale') === 'de' ? 'de' : 'en';
  cookies.delete('session', { path: '/' });
  redirect(303, `/${locale}/login`);
};
