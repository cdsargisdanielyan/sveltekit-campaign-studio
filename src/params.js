import { defineParams } from '@sveltejs/kit/params';
import { localeSchema } from './lib/contracts.js';
export const params = defineParams({ locale: localeSchema });
