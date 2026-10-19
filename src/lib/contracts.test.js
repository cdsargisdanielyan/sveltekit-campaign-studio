import { it, expect } from 'vitest';
import { loginSchema, editSchema, itemSchema } from './contracts.js';
import { initialItems } from './server/data.js';
it('shares login validation and rejects invalid mutations', () => {
  expect(
    loginSchema.safeParse({ email: 'invalid', password: 'short' }).success,
  ).toBe(false);
  expect(
    editSchema.safeParse({
      id: 'cmp_1',
      name: '  ',
      updatedAt: new Date().toISOString(),
    }).success,
  ).toBe(false);
  expect(itemSchema.safeParse({ ...initialItems[0], ctr: 2 }).success).toBe(
    false,
  );
});
