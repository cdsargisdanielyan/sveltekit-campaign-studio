import { defineParams } from '@sveltejs/kit/params';
import { localeSchema } from './lib/contracts.ts';
export const params = defineParams({ locale: localeSchema });
