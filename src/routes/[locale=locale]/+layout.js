import { localeSchema } from '#lib/contracts.js';
/** @type {import('./$types').LayoutLoad} */
export function load({ params }) {
  return { locale: localeSchema.parse(params.locale) };
}
