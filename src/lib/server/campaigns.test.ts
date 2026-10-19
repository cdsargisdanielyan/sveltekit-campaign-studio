import { afterEach, expect, it, vi } from 'vitest';
import { initialItems } from './data.ts';
import { updateItem } from './campaigns.ts';
import { itemSchema } from '../contracts.ts';
afterEach(() => vi.useRealTimers());

it('creates unique versions within a millisecond and rejects stale writes', () => {
  const original = itemSchema.parse(initialItems[0]);
  vi.useFakeTimers();
  vi.setSystemTime(new Date(original.updatedAt));
  const saved = updateItem({
    id: original.id,
    name: 'First change',
    updatedAt: original.updatedAt,
  });
  const next = updateItem({
    id: original.id,
    name: 'Second change',
    updatedAt: saved.updatedAt,
  });
  expect(Date.parse(next.updatedAt)).toBeGreaterThan(
    Date.parse(saved.updatedAt),
  );
  expect(() =>
    updateItem({
      id: original.id,
      name: 'Stale change',
      updatedAt: saved.updatedAt,
    }),
  ).toThrow(expect.objectContaining({ status: 409 }));
  updateItem({
    id: original.id,
    name: original.name,
    updatedAt: next.updatedAt,
  });
});
