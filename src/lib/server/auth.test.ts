import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  authenticate,
  createSession,
  readSession,
  safeReturnTo,
} from './auth.ts';

afterEach(() => vi.useRealTimers());
describe('server-side authentication', () => {
  it('verifies credentials and never exposes fixture passwords', () => {
    expect(authenticate('editor@demo.test', 'wrong-password')).toBeNull();
    expect(authenticate('missing@demo.test', 'demo1234')).toBeNull();
    const user = authenticate('EDITOR@demo.test', 'demo1234');
    expect(user).toMatchObject({ role: 'editor', id: 'demo_editor' });
    expect(user).not.toHaveProperty('password');
  });
  it('rejects tampered, malformed and expired signed sessions', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-20T00:00:00Z'));
    const token = createSession('demo_viewer');
    expect(readSession(token)).toMatchObject({ role: 'viewer' });
    expect(readSession(token + 'x')).toBeNull();
    expect(readSession('malformed')).toBeNull();
    vi.advanceTimersByTime(8 * 60 * 60 * 1000 + 1);
    expect(readSession(token)).toBeNull();
  });
  it('limits return destinations to the current locale dashboard', () => {
    expect(safeReturnTo('https://attacker.test', 'en')).toBe(
      '/en/dashboard/items',
    );
    expect(safeReturnTo('/en/dashboard-other', 'en')).toBe(
      '/en/dashboard/items',
    );
    expect(safeReturnTo('/en/dashboard/../login', 'en')).toBe(
      '/en/dashboard/items',
    );
    expect(safeReturnTo('/en/dashboard/items?page=2', 'en')).toBe(
      '/en/dashboard/items?page=2',
    );
    expect(safeReturnTo('/en/dashboard/items', 'de')).toBe(
      '/de/dashboard/items',
    );
  });
});
