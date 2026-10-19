import { defineEnvVars } from '@sveltejs/kit/env';
export const variables = defineEnvVars({
  SESSION_SECRET: { schema: (value) => value || '' },
  VERCEL: { schema: (value) => value || '' },
  DEMO_FAILURES: { schema: (value) => value || 'false' },
  PUBLIC_SITE_URL: {
    public: true,
    static: true,
    schema: (value) => value || 'http://localhost:4173',
  },
});
