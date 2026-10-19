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
export const postCardSchema = postSchema.extend({
  translations: z.object({
    en: translationSchema.omit({ body: true }),
    de: translationSchema.omit({ body: true }),
  }),
});
export const userSchema = personSchema.extend({
  email: z.email(),
  password: z.string(),
  role: z.enum(['admin', 'editor', 'viewer']),
});
export const publicUserSchema = userSchema.omit({ password: true });
export const campaignPageSchema = z.object({
  items: z.array(itemSchema),
  total: z.number().int().nonnegative(),
  pages: z.number().int().positive(),
  page: z.number().int().positive(),
});
export const campaignEditResponseSchema = z.object({ item: itemSchema });
export const postSearchSchema = z.object({
  posts: z.array(postCardSchema),
  total: z.number().int().nonnegative(),
  pages: z.number().int().positive(),
  page: z.number().int().positive(),
  q: z.string(),
  tag: z.string(),
  sort: z.enum(['newest', 'oldest']),
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
  value: z.number().nonnegative().optional(),
  path: z.string().max(300),
  message: z.string().max(300).optional(),
});

export type Locale = z.infer<typeof localeSchema>;
export type CampaignStatus = z.infer<typeof statusSchema>;
export type Channel = z.infer<typeof channelSchema>;
export type Campaign = z.infer<typeof itemSchema>;
export type Post = z.infer<typeof postSchema>;
export type User = z.infer<typeof userSchema>;
export type PublicUser = z.infer<typeof publicUserSchema>;
export type CampaignPage = z.infer<typeof campaignPageSchema>;
export type CampaignEditResponse = z.infer<typeof campaignEditResponseSchema>;
export type PostSearchResult = z.infer<typeof postSearchSchema>;
export type CampaignEdit = z.infer<typeof editSchema>;
export type Metric = z.infer<typeof metricSchema>;
