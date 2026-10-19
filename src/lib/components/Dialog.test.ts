import { describe, it, expect } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/svelte';
import DialogHarness from './DialogHarness.svelte';
describe('accessible dialog', () => {
  it('moves focus inside and restores it after Escape', async () => {
    const { getByRole, queryByRole } = render(DialogHarness);
    const trigger = getByRole('button', { name: 'Open guide' });
    trigger.focus();
    await fireEvent.click(trigger);
    await waitFor(() =>
      expect(document.activeElement).toBe(
        getByRole('button', { name: 'Close dialog' }),
      ),
    );
    expect(getByRole('dialog').getAttribute('aria-modal')).toBe('true');
    await fireEvent.keyDown(getByRole('dialog'), { key: 'Escape' });
    await waitFor(() => expect(queryByRole('dialog')).toBeNull());
    expect(document.activeElement).toBe(trigger);
  });
  it('traps Tab in both directions', async () => {
    const { getByRole } = render(DialogHarness);
    await fireEvent.click(getByRole('button', { name: 'Open guide' }));
    await waitFor(() =>
      expect(document.activeElement).toBe(
        getByRole('button', { name: 'Close dialog' }),
      ),
    );
    const dialog = getByRole('dialog'),
      first = getByRole('button', { name: 'Close dialog' }),
      last = getByRole('button', { name: 'Last action' });
    last.focus();
    await fireEvent.keyDown(dialog, { key: 'Tab' });
    expect(document.activeElement).toBe(first);
    await fireEvent.keyDown(dialog, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last);
  });
});
