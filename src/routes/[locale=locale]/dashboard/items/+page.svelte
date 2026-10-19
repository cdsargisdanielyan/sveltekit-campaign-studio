<script>
  import { invalidate } from '$app/navigation';
  import { t, money, localized as l } from '#lib/i18n/index.js';
  import { statusSchema, channelSchema } from '#lib/contracts.js';
  import Heading from '#lib/components/Heading.svelte';
  import Select from '#lib/components/Select.svelte';
  import Seo from '#lib/components/Seo.svelte';
  import Card from '#lib/components/Card.svelte';
  import Badge from '#lib/components/Badge.svelte';
  import Dialog from '#lib/components/Dialog.svelte';
  import Skeleton from '#lib/components/Skeleton.svelte';
  import CampaignTable from '#lib/components/CampaignTable.svelte';
  /** @type {{data:import('./$types').PageData}} */ let { data } = $props();
  let help = $state(false);
</script>

<Seo
  title={t(data.locale, 'dashboard.items.title')}
  description={l(
    data.locale,
    'Your campaigns, all in one place.',
    'Deine Kampagnen an einem Ort.',
  )}
  locale={data.locale}
  noindex
/>
<main id="main" class="p-gutter py-10">
  <div class="flex justify-between gap-5 items-start flex-wrap">
    <div>
      <p class="eyebrow mb-3">
        {l(data.locale, 'Workspace / Campaigns', 'Arbeitsbereich / Kampagnen')}
      </p>
      <Heading>{t(data.locale, 'dashboard.items.title')}</Heading>
      <p class="muted mt-3 text-sm">
        {l(
          data.locale,
          'The big picture. And every little detail.',
          'Das große Ganze. Und jedes kleine Detail.',
        )}
      </p>
    </div>
    <button class="button secondary" onclick={() => (help = true)}
      >{l(data.locale, 'Workspace guide', 'Arbeitsbereich-Hilfe')}
      <span aria-hidden="true">↗</span></button
    >
  </div>
  <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 mt-8 mb-8">
    <Card
      ><p class="text-xs muted">
        {l(data.locale, 'Total campaigns', 'Alle Kampagnen')}
      </p>
      <p class="text-3xl font-semibold mt-3">{data.summary.count}</p>
      <p class="text-xs muted mt-3">
        {l(data.locale, 'Across five channels', 'Über fünf Kanäle')}
      </p></Card
    ><Card
      ><p class="text-xs muted">
        {l(data.locale, 'Active now', 'Jetzt aktiv')}
      </p>
      <p class="text-3xl font-semibold mt-3">{data.summary.active}</p>
      <p class="text-xs text-positive mt-3">
        ● {l(data.locale, 'Making an impression', 'Hinterlassen Eindruck')}
      </p></Card
    ><Card
      ><p class="text-xs muted">
        {l(data.locale, 'Total budget', 'Gesamtbudget')}
      </p>
      <p class="text-3xl font-semibold mt-3">
        {money(data.locale, data.summary.budget)}
      </p>
      <p class="text-xs muted mt-3">
        {l(data.locale, 'Planned investment', 'Geplante Investition')}
      </p></Card
    ><Card
      ><p class="text-xs muted">
        {l(data.locale, 'Total spend', 'Gesamtausgaben')}
      </p>
      <p class="text-3xl font-semibold mt-3">
        {money(data.locale, data.summary.spent)}
      </p>
      <p class="text-xs muted mt-3">
        {new Intl.NumberFormat(data.locale, {
          style: 'percent',
          maximumFractionDigits: 1,
        }).format(data.summary.spent / data.summary.budget)}
        {l(data.locale, 'of budget', 'des Budgets')}
      </p></Card
    >
  </div>
  <div class="flex justify-between items-center mb-5">
    <h2 class="text-lg font-semibold">
      {l(data.locale, 'All campaigns', 'Alle Kampagnen')}
    </h2>
    <Badge>{data.user.role} · {data.user.name}</Badge>
  </div>
  <form method="GET" class="filter-panel mb-6">
    <div class="filter-top">
      <div class="flex-1 min-w-48">
        <label class="label" for="q"
          >{l(data.locale, 'Search campaigns', 'Kampagnen suchen')}</label
        ><input
          class="field"
          id="q"
          name="q"
          value={data.query.q}
          placeholder={l(
            data.locale,
            'Search by campaign name…',
            'Nach Kampagnenname suchen…',
          )}
        />
      </div>
      <Select
        id="owner"
        label={t(data.locale, 'dashboard.items.column.owner')}
        value={data.query.owner}
        options={[
          {
            value: '',
            label: l(data.locale, 'All owners', 'Alle Verantwortlichen'),
          },
          ...data.owners.map((owner) => ({
            value: owner.id,
            label: owner.name,
          })),
        ]}
      />
      <input type="hidden" name="sort" value={data.query.sort} /><input
        type="hidden"
        name="direction"
        value={data.query.direction}
      /><button class="button"
        >{l(data.locale, 'Apply filters', 'Filter anwenden')}</button
      ><a class="button ghost" href="/{data.locale}/dashboard/items"
        >{l(data.locale, 'Reset', 'Zurücksetzen')}</a
      >
    </div>
    <div class="filter-facets">
      <fieldset>
        <legend>{t(data.locale, 'dashboard.items.column.status')}</legend>
        <div>
          {#each statusSchema.options as status (status)}<label
              ><input
                type="checkbox"
                name="status"
                value={status}
                checked={data.query.statuses.includes(status)}
              />{status}</label
            >{/each}
        </div>
      </fieldset>
      <fieldset>
        <legend>{t(data.locale, 'dashboard.items.column.channel')}</legend>
        <div>
          {#each channelSchema.options as channel (channel)}<label
              ><input
                type="checkbox"
                name="channel"
                value={channel}
                checked={data.query.channels.includes(channel)}
              />{channel}</label
            >{/each}
        </div>
      </fieldset>
    </div>
  </form>
  {#await data.rows}<Skeleton
      label={t(data.locale, 'common.loading')}
    />{:then result}{#if result.ok && result.data}<CampaignTable
        result={result.data}
        locale={data.locale}
        role={data.user.role}
        query={data.query}
        demoFailures={data.demoFailures}
      />{:else}<div class="error" role="alert">
        <h2 class="font-semibold">{t(data.locale, 'common.error')}</h2>
        <p class="my-3">
          {l(
            data.locale,
            'The campaign list is temporarily unavailable. Summary information is still available.',
            'Die Kampagnenliste ist vorübergehend nicht verfügbar. Zusammenfassung bleibt verfügbar.',
          )}
        </p>
        <button
          class="button secondary"
          onclick={() => invalidate('campaigns:list')}
          >{t(data.locale, 'common.retry')}</button
        >
      </div>{/if}{:catch}<div class="error" role="alert">
      {l(
        data.locale,
        'Connection interrupted. Reload the page to reconnect.',
        'Verbindung unterbrochen. Seite neu laden.',
      )}
    </div>{/await}
</main>
<Dialog
  bind:open={help}
  title={l(data.locale, 'Make yourself at home', 'Fühl dich wie zu Hause')}
  description={l(
    data.locale,
    'Everything you need to explore this demo workspace.',
    'Alles, was du zum Erkunden dieses Demo-Arbeitsbereichs brauchst.',
  )}
  ><ul class="text-sm muted space-y-4 mb-6">
    <li>
      {l(
        data.locale,
        'Filters and sorting are saved in the URL. Share a view or use your browser’s back button.',
        'Filter und Sortierung werden in der URL gespeichert. Ansicht teilen oder Zurück-Taste nutzen.',
      )}
    </li>
    <li>
      {l(
        data.locale,
        'Admins and editors can use the pencil button to edit a campaign name. Viewers have read-only access.',
        'Admins und Editoren können Kampagnennamen bearbeiten. Viewer haben Lesezugriff.',
      )}
    </li>
    <li>
      {l(
        data.locale,
        'Use Tab to navigate. Escape closes this dialog.',
        'Mit Tab navigieren. Escape schließt dieses Dialogfenster.',
      )}
    </li>
  </ul>
  <button class="button" onclick={() => (help = false)}
    >{l(data.locale, 'Got it', 'Verstanden')}</button
  ></Dialog
>

<style>
  .filter-panel {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 12px;
    padding: 20px;
  }
  .filter-top {
    display: flex;
    align-items: end;
    gap: 12px;
    flex-wrap: wrap;
  }
  .filter-facets {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    border-top: 1px solid var(--line);
    margin-top: 20px;
    padding-top: 16px;
  }
  fieldset {
    min-width: 0;
  }
  legend {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  fieldset > div {
    display: flex;
    gap: 8px 14px;
    flex-wrap: wrap;
  }
  fieldset label {
    font-size: 12px;
    color: var(--muted);
    display: flex;
    align-items: center;
    gap: 5px;
    text-transform: capitalize;
  }
  input[type='checkbox'] {
    accent-color: var(--accent);
    min-width: 16px;
    min-height: 16px;
  }
  @media (max-width: 700px) {
    .filter-facets {
      grid-template-columns: 1fr;
    }
  }
</style>
