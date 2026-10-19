import type { User } from '../contracts.ts';
import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto';
import * as env from '$app/env/private';
import { users } from './data.ts';
import { publicUserSchema, sessionSchema } from '../contracts.ts';

const fallbackSecret = randomBytes(32).toString('hex');
function secret() {
  if (env.VERCEL && (!env.SESSION_SECRET || env.SESSION_SECRET.length < 32))
    throw new Error(
      'Set SESSION_SECRET to at least 32 characters before deployment.',
    );
  return env.SESSION_SECRET || fallbackSecret;
}

const sign = (value: string) =>
  createHmac('sha256', secret()).update(value).digest('base64url');

function equal(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function authenticate(email: string, password: string) {
  const user = users.find(
    (candidate) => candidate.email.toLowerCase() === email.toLowerCase(),
  );
  const valid = equal(
    sign(password),
    sign(user?.password || 'invalid-demo-password'),
  );
  return user && valid ? publicUser(user) : null;
}

function publicUser(user: User) {
  return publicUserSchema.parse(user);
}

export function createSession(userId: string) {
  const body = Buffer.from(
    JSON.stringify({ userId, expires: Date.now() + 8 * 60 * 60 * 1000 }),
  ).toString('base64url');
  return `${body}.${sign(body)}`;
}

export function readSession(token: string | undefined) {
  if (!token) return null;
  const [body, signature] = token.split('.');
  if (!body || !signature || !equal(sign(body), signature)) return null;
  try {
    const parsed = sessionSchema.safeParse(
      JSON.parse(Buffer.from(body, 'base64url').toString()),
    );
    if (!parsed.success || parsed.data.expires < Date.now()) return null;
    const user = users.find((candidate) => candidate.id === parsed.data.userId);
    return user ? publicUser(user) : null;
  } catch {
    return null;
  }
}

export function safeReturnTo(destination: string | null, locale: string) {
  const dashboard = `/${locale}/dashboard`;
  return destination &&
    (destination === dashboard ||
      destination.startsWith(`${dashboard}/`) ||
      destination.startsWith(`${dashboard}?`)) &&
    !destination.includes('\\') &&
    !destination.split('?')[0]?.includes('..')
    ? destination
    : `/${locale}/dashboard/items`;
}
