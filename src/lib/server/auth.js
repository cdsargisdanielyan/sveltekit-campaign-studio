import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto';
import * as env from '$app/env/private';
import { users } from './data.js';
import { sessionSchema } from '../contracts.js';

const fallbackSecret = randomBytes(32).toString('hex');
function secret() {
  if (env.VERCEL && (!env.SESSION_SECRET || env.SESSION_SECRET.length < 32))
    throw new Error(
      'Set SESSION_SECRET to at least 32 characters before deployment.',
    );
  return env.SESSION_SECRET || fallbackSecret;
}
/** @param {string} value */
const sign = (value) =>
  createHmac('sha256', secret()).update(value).digest('base64url');
/** @param {string} left @param {string} right */
function equal(left, right) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}
/** @param {string} email @param {string} password */
export function authenticate(email, password) {
  const user = users.find(
    (candidate) => candidate.email.toLowerCase() === email.toLowerCase(),
  );
  const valid = equal(
    sign(password),
    sign(user?.password || 'invalid-demo-password'),
  );
  return user && valid ? publicUser(user) : null;
}
/** @param {import('zod').infer<typeof import('../contracts.js').userSchema>} user */
function publicUser(user) {
  return { id: user.id, name: user.name, role: user.role, email: user.email };
}
/** @param {string} userId */
export function createSession(userId) {
  const body = Buffer.from(
    JSON.stringify({ userId, expires: Date.now() + 8 * 60 * 60 * 1000 }),
  ).toString('base64url');
  return `${body}.${sign(body)}`;
}
/** @param {string | undefined} token */
export function readSession(token) {
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
/** @param {string | null} destination @param {string} locale */
export function safeReturnTo(destination, locale) {
  return destination?.startsWith(`/${locale}/dashboard`) &&
    !destination.includes('\\')
    ? destination
    : `/${locale}/dashboard/items`;
}
