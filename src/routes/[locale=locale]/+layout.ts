import type { LayoutLoad } from './$types';
import { localeSchema } from '#lib/contracts.ts';

export const load: LayoutLoad = ({ params }) => {
  return { locale: localeSchema.parse(params.locale) };
};
