<script lang="ts">
  import { tick } from 'svelte';
  import type {
    CampaignPage,
    Campaign,
    Locale,
    PublicUser,
  } from '../contracts.ts';
  import type { ItemQuery } from '../query.ts';
  import { SvelteSet } from 'svelte/reactivity';
  import { page } from '$app/state';
  import { invalidate } from '$app/navigation';
  import { editSchema, campaignEditResponseSchema } from '#lib/contracts.ts';
  import { queryLink } from '#lib/query.ts';
  import {
    t,
    date,
    money,
    localized as l,
    campaignLabel,
  } from '#lib/i18n/index.ts';
  import Badge from './Badge.svelte';

  let {
    result,
    locale,
    role,
    query,
    demoFailures,
    onnotice,
    onsettled,
  }: {
    result: CampaignPage;
    locale: Locale;
    role: PublicUser['role'];
    query: ItemQuery;
    demoFailures: boolean;
    onnotice: (message: string, error: boolean) => void;
    onsettled: (id: string) => void;
  } = $props();
  let edits: Record<string, Pick<Campaign, 'name' | 'updatedAt'>> = $state({});
  let editing: string | null = $state(null);
  let draft = $state('');
  const pending = new SvelteSet();
  let simulate = $state(false);
  function focusEditor(node: HTMLInputElement) {
    void tick().then(() => {
      if (node.isConnected) {
        node.focus();
        node.select();
      }
    });
  }
  async function closeEditor(id: string) {
    editing = null;
    await tick();
    document.getElementById(`edit-${id}`)?.focus();
  }
  const columns = [
    ['name', 'dashboard.items.column.name'],
    ['status', 'dashboard.items.column.status'],
    ['channel', 'dashboard.items.column.channel'],
    ['owner', 'dashboard.items.column.owner'],
    ['budget', 'dashboard.items.column.budget'],
    ['spent', 'dashboard.items.column.spent'],
    ['ctr', 'dashboard.items.column.ctr'],
    ['updatedAt', 'dashboard.items.column.updated'],
  ] as const;
  function sortLink(key: ItemQuery['sort']) {
    return queryLink(page.url, {
      sort: key,
      direction:
        query.sort === key && query.direction === 'asc' ? 'desc' : 'asc',
      page: null,
    });
  }

  async function save(item: Campaign) {
    const previous = edits[item.id];
    const original = previous || item;
    const input = editSchema.safeParse({
      id: item.id,
      name: draft,
      updatedAt: original.updatedAt,
    });
    if (!input.success) {
      onnotice(
        l(
          locale,
          'Use a name between 3 and 100 characters.',
          'Name muss 3 bis 100 Zeichen enthalten.',
        ),
        true,
      );
      return;
    }
    edits[item.id] = { name: input.data.name, updatedAt: original.updatedAt };
    editing = null;
    pending.add(item.id);
    onnotice(l(locale, 'Saving change…', 'Änderung wird gespeichert…'), false);
    try {
      const response = await fetch('/api/items', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(simulate ? { 'x-demo-failure': 'true' } : {}),
        },
        body: JSON.stringify(input.data),
      });
      if (!response.ok) {
        const messages: Partial<Record<number, string>> = {
          401: l(
            locale,
            'Your session expired. Sign in again.',
            'Sitzung abgelaufen. Bitte erneut anmelden.',
          ),
          403: l(
            locale,
            'You do not have permission to edit this campaign.',
            'Keine Berechtigung zum Bearbeiten.',
          ),
          409: l(
            locale,
            'This campaign changed. Refresh and try again.',
            'Kampagne wurde geändert. Bitte aktualisieren.',
          ),
          422: l(
            locale,
            'The campaign name was rejected. Check its length.',
            'Der Name wurde abgelehnt. Bitte Länge prüfen.',
          ),
        };
        throw new Error(
          messages[response.status] ||
            l(
              locale,
              'Save failed. The original value has been restored.',
              'Speichern fehlgeschlagen. Ursprünglicher Wert wiederhergestellt.',
            ),
        );
      }
      const payload: unknown = await response.json();
      const { item: saved } = campaignEditResponseSchema.parse(payload);
      edits[item.id] = { name: saved.name, updatedAt: saved.updatedAt };
      onnotice(l(locale, 'Campaign updated.', 'Kampagne aktualisiert.'), false);
    } catch (error) {
      if (previous) edits[item.id] = previous;
      else delete edits[item.id];
      const message =
        error instanceof TypeError
          ? l(
              locale,
              'Connection lost. We could not confirm the save; check your connection and try again.',
              'Verbindung verloren. Speichern konnte nicht bestätigt werden. Verbindung prüfen und erneut versuchen.',
            )
          : error instanceof Error
            ? error.message
            : l(
                locale,
                'Network error. Original value restored.',
                'Netzwerkfehler. Ursprünglicher Wert wiederhergestellt.',
              );
      onnotice(message, true);
    } finally {
      pending.delete(item.id);
      simulate = false;
      await invalidate('campaigns:list');
      onsettled(item.id);
    }
  }
</script>

{#if demoFailures && role !== 'viewer'}<label
    class="flex items-center gap-2 mb-4 text-xs muted"
    ><input type="checkbox" bind:checked={simulate} />{l(
      locale,
      'Fail next save (demo rollback)',
      'Nächstes Speichern fehlschlagen lassen (Demo)',
    )}</label
  >{/if}
{#if result.items.length === 0}<div class="card py-16 text-center">
    <h2 class="text-xl font-semibold">
      {l(
        locale,
        'No campaigns match these filters.',
        'Keine Kampagnen für diese Filter.',
      )}
    </h2>
    <p class="muted my-4">
      {l(
        locale,
        'Try a broader search or clear the selected filters.',
        'Suche erweitern oder Filter zurücksetzen.',
      )}
    </p>
    <a class="button secondary" href="/{locale}/dashboard/items"
      >{l(locale, 'Clear filters', 'Filter zurücksetzen')}</a
    >
  </div>
{:else}
  <!-- svelte-ignore a11y_no_noninteractive_tabindex (Keyboard users need to scroll the wide table.) -->
  <div
    class="table-frame"
    id="campaign-results"
    role="region"
    aria-label={t(locale, 'dashboard.items.title')}
    tabindex="0"
  >
    <table>
      <caption class="sr-only"
        >{l(
          locale,
          'Campaigns. Select a column heading to sort. Editors can change a campaign name.',
          'Kampagnen. Spaltenüberschrift zum Sortieren auswählen. Editoren können Namen bearbeiten.',
        )}</caption
      ><thead
        ><tr
          >{#each columns as [key, label] (key)}<th
              scope="col"
              aria-sort={query.sort === key
                ? query.direction === 'asc'
                  ? 'ascending'
                  : 'descending'
                : undefined}
              ><a href={sortLink(key)}
                >{t(locale, label)}
                <span aria-hidden="true"
                  >{query.sort === key
                    ? query.direction === 'asc'
                      ? '↑'
                      : '↓'
                    : '↕'}</span
                ></a
              ></th
            >{/each}</tr
        ></thead
      ><tbody
        >{#each result.items as item (item.id)}<tr
            aria-busy={pending.has(item.id)}
            ><th scope="row"
              ><div class="name-cell">
                {#if editing === item.id}<form
                    class="flex items-center gap-2"
                    onsubmit={(event) => {
                      event.preventDefault();
                      save(item);
                    }}
                  >
                    <input
                      class="field min-w-48"
                      use:focusEditor
                      onkeydown={(event) => {
                        if (event.key === 'Escape') {
                          event.preventDefault();
                          closeEditor(item.id);
                        }
                      }}
                      aria-label={l(locale, 'Campaign name', 'Kampagnenname')}
                      bind:value={draft}
                      minlength="3"
                      maxlength="100"
                      required
                    /><button class="small-button" type="submit"
                      >{t(locale, 'common.save')}</button
                    ><button
                      class="small-button"
                      type="button"
                      onclick={() => closeEditor(item.id)}
                      >{t(locale, 'common.cancel')}</button
                    >
                  </form>{:else}<span data-testid="campaign-name"
                    >{edits[item.id]?.name || item.name}</span
                  >{#if role !== 'viewer'}<button
                      class="edit-button"
                      id={`edit-${item.id}`}
                      disabled={pending.size > 0}
                      aria-label={`${l(locale, 'Edit', 'Bearbeiten')} ${edits[item.id]?.name || item.name}`}
                      onclick={() => {
                        editing = item.id;
                        draft = edits[item.id]?.name || item.name;
                      }}>✎</button
                    >{/if}{#if pending.has(item.id)}<span
                      class="text-xs muted"
                      role="status">{l(locale, 'Saving…', 'Speichern…')}</span
                    >{/if}{/if}
              </div>
              <span class="text-xs muted font-normal">{item.id}</span></th
            ><td
              ><Badge status={item.status}
                >{campaignLabel(locale, item.status)}</Badge
              ></td
            ><td class="capitalize">{campaignLabel(locale, item.channel)}</td
            ><td>{item.owner.name}</td><td>{money(locale, item.budget)}</td><td
              >{money(locale, item.spent)}</td
            ><td
              >{new Intl.NumberFormat(locale, {
                style: 'percent',
                maximumFractionDigits: 2,
              }).format(item.ctr)}</td
            ><td class="whitespace-nowrap">{date(locale, item.updatedAt)}</td
            ></tr
          >{/each}</tbody
      >
    </table>
  </div>{/if}
<nav
  class="flex justify-between items-center flex-wrap gap-4 mt-5 text-sm"
  aria-label={l(locale, 'Campaign pagination', 'Kampagnenseiten')}
>
  <p class="muted">
    {result.total
      ? `${(result.page - 1) * query.pageSize + 1}–${Math.min(result.page * query.pageSize, result.total)}`
      : '0'} / {new Intl.NumberFormat(locale).format(result.total)}
    {l(locale, 'campaigns', 'Kampagnen')}
  </p>
  <div class="flex items-center gap-4">
    {#if result.page > 1}<a
        class="button secondary"
        href={queryLink(page.url, { page: String(result.page - 1) })}
        >← {l(locale, 'Previous', 'Zurück')}</a
      >{/if}<span>{result.page} / {result.pages}</span
    >{#if result.page < result.pages}<a
        class="button secondary"
        href={queryLink(page.url, { page: String(result.page + 1) })}
        >{l(locale, 'Next', 'Weiter')} →</a
      >{/if}
  </div>
</nav>

<style>
  .table-frame {
    overflow-x: auto;
    border: 1px solid var(--line);
    border-radius: 12px;
    background: var(--surface);
  }
  table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
    font-size: 12px;
  }
  thead {
    background: var(--soft);
    color: var(--muted);
  }
  th,
  td {
    padding: 16px;
    border-bottom: 1px solid var(--line);
  }
  thead a {
    white-space: nowrap;
    display: flex;
    gap: 10px;
    align-items: center;
    font-weight: 550;
  }
  tbody th {
    font-weight: 550;
    min-width: 290px;
  }
  tbody tr:last-child th,
  tbody tr:last-child td {
    border-bottom: 0;
  }
  .name-cell {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 4px;
  }
  .edit-button {
    border: 1px solid var(--line);
    border-radius: 6px;
    min-width: 32px;
    min-height: 32px;
    color: var(--accent);
    font-size: 18px;
  }
  .small-button {
    font-size: 12px;
    color: var(--accent);
    padding: 10px 4px;
  }
</style>
