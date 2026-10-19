import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { loginSchema } from '#lib/contracts.ts';
import { authenticate, createSession, safeReturnTo } from '#lib/server/auth.ts';

export const load: PageServerLoad = ({ locals, params }) => {
  if (locals.user) redirect(303, `/${params.locale}/dashboard/items`);
};

export const actions: Actions = {
  default: async ({ request, cookies, url, params }) => {
    const fields = Object.fromEntries(await request.formData());
    const parsed = loginSchema.safeParse(fields);
    if (!parsed.success)
      return fail(422, { invalid: true, email: String(fields.email || '') });
    const user = authenticate(parsed.data.email, parsed.data.password);
    if (!user) return fail(401, { invalid: true, email: parsed.data.email });
    cookies.set('session', createSession(user.id), {
      path: '/',
      httpOnly: true,
      secure: url.protocol === 'https:',
      sameSite: 'lax',
      maxAge: 8 * 60 * 60,
    });
    redirect(
      303,
      safeReturnTo(url.searchParams.get('returnTo'), params.locale),
    );
  },
};
