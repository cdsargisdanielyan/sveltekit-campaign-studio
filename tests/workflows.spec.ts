import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {
  campaignEditResponseSchema,
  itemSchema,
} from '../src/lib/contracts.ts';
import fixtureItems from '../src/lib/server/fixtures/items.json' with { type: 'json' };

async function login(
  page: import('@playwright/test').Page,
  role: string = 'editor',
) {
  await page.goto('/en/login');
  await page.getByLabel('Email', { exact: true }).fill(`${role}@demo.test`);
  await page.getByLabel('Password', { exact: true }).fill('demo1234');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'Campaigns', exact: true }),
  ).toBeVisible();
  await expect(page.locator('tbody tr')).toHaveCount(20);
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  await expect(page.locator('link[hreflang="de"]')).toHaveAttribute(
    'href',
    /\/de\/dashboard\/items$/,
  );
}
test('anonymous search → post, URL navigation and locale', async ({ page }) => {
  await page.goto('/en/search');
  await page.getByLabel('Search', { exact: true }).fill('LCP');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page).toHaveURL(/q=LCP/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    /\/en\/search\?q=LCP$/,
  );
  await page
    .getByRole('heading', { name: 'Sub-second LCP on a content site' })
    .click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Sub-second LCP on a content site',
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    /\/en\/blog\/sub-second-lcp/,
  );
  await page.goBack();
  await expect(page.getByLabel('Search', { exact: true })).toHaveValue('LCP');
  await page.getByRole('link', { name: 'DE — Switch to German' }).click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
});
test('editor sees optimistic save, successful persistence, rollback and accessible dashboard', async ({
  page,
}) => {
  await login(page);
  const row = page.locator('tbody tr').first();
  const original = await row.getByTestId('campaign-name').innerText();
  await page.route('**/api/items', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await route.continue();
  });
  await row.getByRole('button', { name: /^Edit / }).click();
  await page
    .getByRole('textbox', { name: 'Campaign name', exact: true })
    .fill('A considered campaign');
  await row.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByText('Saving change…', { exact: true })).toBeVisible();
  await expect(
    page
      .getByTestId('campaign-name')
      .filter({ hasText: 'A considered campaign' }),
  ).toBeVisible();
  await expect(
    page.getByRole('status').filter({ hasText: 'Campaign updated.' }),
  ).toBeVisible();
  await page.reload();
  await expect(
    page
      .getByTestId('campaign-name')
      .filter({ hasText: 'A considered campaign' }),
  ).toBeVisible();
  await page.getByLabel('Fail next save (demo rollback)').check();
  const changedRow = page
    .locator('tbody tr')
    .filter({ hasText: 'A considered campaign' });
  await changedRow.getByRole('button', { name: /^Edit / }).click();
  await page
    .getByRole('textbox', { name: 'Campaign name', exact: true })
    .fill('This must roll back');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText(
    'original value has been restored',
  );
  await expect(
    page
      .getByTestId('campaign-name')
      .filter({ hasText: 'A considered campaign' }),
  ).toBeVisible();
  await expect(
    page.getByText('This must roll back', { exact: true }),
  ).toHaveCount(0);
  await page.route('**/api/items', (route) => route.abort('failed'));
  await changedRow.getByRole('button', { name: /^Edit / }).click();
  await page
    .getByRole('textbox', { name: 'Campaign name', exact: true })
    .fill('Unconfirmed change');
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText(
    'We could not confirm the save',
  );
  await expect(
    page.getByText('Unconfirmed change', { exact: true }),
  ).toHaveCount(0);
  await expect(
    page
      .getByTestId('campaign-name')
      .filter({ hasText: 'A considered campaign' }),
  ).toBeVisible();
  await page.unroute('**/api/items');
  const results = await new AxeBuilder({ page }).analyze();
  expect(
    results.violations.filter((v) =>
      ['serious', 'critical'].includes(v.impact || ''),
    ),
  ).toEqual([]);
  await page.getByRole('button', { name: 'Workspace guide' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(
    page.getByRole('button', { name: 'Workspace guide' }),
  ).toBeFocused();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.getByRole('button', { name: 'Toggle color theme' }).click();
  const darkResults = await new AxeBuilder({ page }).analyze();
  expect(
    darkResults.violations.filter((v) =>
      ['serious', 'critical'].includes(v.impact || ''),
    ),
  ).toEqual([]);
  // Restore the supplied fixture value, keeping this test repeatable.
  await changedRow.getByRole('button', { name: /^Edit / }).click();
  await page
    .getByRole('textbox', { name: 'Campaign name', exact: true })
    .fill(original);
  await page.getByRole('button', { name: 'Save', exact: true }).click();
  await expect(
    page.getByRole('status').filter({ hasText: 'Campaign updated.' }),
  ).toBeVisible();
});
test('viewer is read-only and server rejects forged writes', async ({
  page,
}) => {
  await login(page, 'viewer');
  await expect(page.getByRole('button', { name: /^Edit / })).toHaveCount(0);
  const response = await page.request.patch('/api/items', {
    headers: { Origin: 'http://localhost:4173' },
    data: {
      id: 'cmp_0001',
      name: 'Unauthorized change',
      updatedAt: '2026-04-09T22:00:00Z',
    },
  });
  expect(response.status()).toBe(403);
  await page.getByRole('link', { name: 'DE — Switch to German' }).click();
  await page.getByRole('button', { name: 'Abmelden', exact: true }).click();
  await expect(page).toHaveURL(/\/de\/login$/);
  expect(
    (await page.context().cookies()).some(
      (cookie) => cookie.name === 'session',
    ),
  ).toBe(false);
  const anonymous = await page.request.patch('/api/items', { data: {} });
  expect(anonymous.status()).toBe(401);
});
test('public marketing visual baseline', async ({ page }) => {
  await page.goto('/en');
  await page.evaluate(() => (document.documentElement.dataset.theme = 'light'));
  // Isolate chart geometry from surrounding system-font metrics and rotated bounds.
  await page.addStyleTag({
    content:
      '.preview-window { transform: none !important; } .bars { position: fixed; top: 0; left: 0; width: 360px; margin: 0; z-index: 100; background: var(--surface); }',
  });
  await expect(page.locator('.bars')).toHaveScreenshot('campaign-bars.png', {
    maxDiffPixelRatio: 0.01,
    animations: 'disabled',
  });
});
test('protected routes redirect and unavailable routes return 404', async ({
  page,
}) => {
  await page.goto('/en/dashboard/items');
  await expect(page).toHaveURL(/\/en\/login\?returnTo=/);
  const response = await page.goto('/404');
  expect(response?.status()).toBe(404);
});

test('rows stream after the shell and service failures preserve the summary', async ({
  page,
}) => {
  await login(page, 'viewer');
  const chunks = await page.evaluate(async () => {
    const response = await fetch('/en/dashboard/items?demo=slow');
    if (!response.body) throw new Error('Expected a streamed response body');
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const parts = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      parts.push(decoder.decode(value));
    }
    return parts;
  });
  const shell = chunks.findIndex((chunk) => chunk.includes('aria-busy="true"'));
  const rows = chunks.findIndex((chunk) => chunk.includes('cmp_'));
  expect(shell).toBeGreaterThanOrEqual(0);
  expect(rows).toBeGreaterThan(shell);
  await page.goto('/en/dashboard/items?demo=load-error');
  await expect(page.getByRole('alert')).toContainText(
    'Summary information is still available',
  );
  await expect(page.getByText('220', { exact: true })).toBeVisible();
  const beacon = await page.request.post('/api/beacon', {
    headers: {
      Origin: 'http://localhost:4173',
      'Content-Type': 'application/json',
    },
    data: '{invalid',
  });
  expect(beacon.status()).toBe(400);
});

test('server validates mutations, rejects stale versions and checks request origin', async ({
  page,
}) => {
  await login(page);
  const original = itemSchema.parse(
    fixtureItems.find((item) => item.id === 'cmp_0220'),
  );
  const input = {
    id: original.id,
    name: original.name,
    updatedAt: original.updatedAt,
  };
  const headers = { Origin: 'http://localhost:4173' };
  expect(
    (
      await page.request.patch('/api/items', {
        headers,
        data: { ...input, name: 'x' },
      })
    ).status(),
  ).toBe(422);
  expect(
    (
      await page.request.patch('/api/items', {
        headers: { Origin: 'https://untrusted.test' },
        data: input,
      })
    ).status(),
  ).toBe(403);
  const savedResponse = await page.request.patch('/api/items', {
    headers,
    data: { ...input, name: 'Versioned campaign' },
  });
  expect(savedResponse.status()).toBe(200);
  const { item: saved } = campaignEditResponseSchema.parse(
    await savedResponse.json(),
  );
  expect(
    (await page.request.patch('/api/items', { headers, data: input })).status(),
  ).toBe(409);
  const restored = await page.request.patch('/api/items', {
    headers,
    data: { ...input, updatedAt: saved.updatedAt },
  });
  expect(restored.status()).toBe(200);
});

test('dashboard sorting, filtering, pagination and editing work with the keyboard', async ({
  page,
}) => {
  await login(page);
  await page.getByRole('link', { name: 'Name', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/sort=name/);
  await page.getByRole('checkbox', { name: 'Active', exact: true }).focus();
  await page.keyboard.press('Space');
  await page
    .getByRole('button', { name: 'Apply filters', exact: true })
    .focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/status=active/);
  await page.getByRole('link', { name: 'Next →', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/page=2/);
  await expect(page.locator('tbody tr')).toHaveCount(20);
  const row = page.locator('tbody tr').first();
  const original = await row.getByTestId('campaign-name').innerText();
  const renamed = `${original} keyboard`;
  await row.getByRole('button', { name: /^Edit / }).focus();
  await page.keyboard.press('Enter');
  const editor = page.getByRole('textbox', {
    name: 'Campaign name',
    exact: true,
  });
  await expect(editor).toBeFocused();
  await page.keyboard.type(renamed);
  await page.keyboard.press('Escape');
  await expect(row.getByRole('button', { name: /^Edit / })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(editor).toBeFocused();
  await page.keyboard.type(renamed);
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('status').filter({ hasText: 'Campaign updated.' }),
  ).toBeVisible();
  const updated = page.getByRole('button', {
    name: `Edit ${renamed}`,
    exact: true,
  });
  await expect(updated).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(editor).toBeFocused();
  await page.keyboard.type(original);
  await page.keyboard.press('Enter');
  await expect(
    page.getByRole('status').filter({ hasText: 'Campaign updated.' }),
  ).toBeVisible();
});
