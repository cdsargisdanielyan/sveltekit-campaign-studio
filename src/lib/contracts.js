import { z } from 'zod';

export const localeSchema = z.enum(['en', 'de']);
export const statusSchema = z.enum([
  'draft',
  'scheduled',
  'active',
  'paused',
  'completed',
  'archived',
]);
export const channelSchema = z.enum(['email', 'sms', 'web', 'social', 'push']);
const personSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
});
const colorSchema = z.string().regex(/^#[\da-f]{6}$/i);
const translationSchema = z.object({
  title: z.string(),
  excerpt: z.string(),
  body: z.string(),
});
export const postSchema = z.object({
  id: z.string(),
  slug: z.string(),
  translations: z.object({ en: translationSchema, de: translationSchema }),
  tags: z.array(z.string()),
  author: personSchema.extend({ avatarColor: colorSchema }),
  publishedAt: z.iso.datetime(),
  readingTimeMinutes: z.number().positive(),
  coverColor: colorSchema,
});
export const itemSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  status: statusSchema,
  channel: channelSchema,
  owner: personSchema,
  budget: z.number().nonnegative(),
  spent: z.number().nonnegative(),
  impressions: z.number().int().nonnegative(),
  clicks: z.number().int().nonnegative(),
  ctr: z.number().min(0).max(1),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
  updatedAt: z.iso.datetime(),
  tags: z.array(z.string()),
});
export const userSchema = personSchema.extend({
  email: z.email(),
  password: z.string(),
  role: z.enum(['admin', 'editor', 'viewer']),
});
export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(128),
});
export const editSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(3).max(100),
  updatedAt: z.iso.datetime(),
});
export const tagSchema = z.object({
  slug: z.string(),
  label: z.object({ en: z.string(), de: z.string() }),
});
export const sessionSchema = z.object({
  userId: z.string(),
  expires: z.number(),
});
export const metricSchema = z.object({
  kind: z.enum(['vital', 'error']),
  name: z.string().max(80),
  value: z.number().optional(),
  path: z.string().max(300),
  message: z.string().max(300).optional(),
});
