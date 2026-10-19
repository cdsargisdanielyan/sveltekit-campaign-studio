<script lang="ts">
  import type { PageData } from './$types';
  import Heading from '#lib/components/Heading.svelte';
  import Seo from '#lib/components/Seo.svelte';
  import Card from '#lib/components/Card.svelte';
  import Button from '#lib/components/Button.svelte';
  import { money, localized as l, t } from '#lib/i18n/index.ts';
  let { data }: { data: PageData } = $props();
</script>

<Seo
  title={t(data.locale, 'dashboard.title')}
  description="Workspace overview"
  locale={data.locale}
/>
<main id="main" class="p-gutter py-10">
  <Heading eyebrow={l(data.locale, 'Your workspace', 'Dein Arbeitsbereich')}
    >{l(
      data.locale,
      'A little clarity for your day.',
      'Ein wenig Klarheit für deinen Tag.',
    )}</Heading
  >
  <p class="muted mt-4">
    {l(data.locale, 'Welcome back', 'Willkommen zurück')}, {data.user.name}.
  </p>
  <div class="grid gap-4 md:grid-cols-3 my-8">
    <Card
      ><p class="text-sm muted">{t(data.locale, 'dashboard.items.title')}</p>
      <p class="text-4xl font-semibold mt-4">{data.summary.count}</p></Card
    ><Card
      ><p class="text-sm muted">
        {l(data.locale, 'Active campaigns', 'Aktive Kampagnen')}
      </p>
      <p class="text-4xl font-semibold mt-4">{data.summary.active}</p></Card
    ><Card
      ><p class="text-sm muted">
        {l(data.locale, 'Total spend', 'Gesamtausgaben')}
      </p>
      <p class="text-4xl font-semibold mt-4">
        {money(data.locale, data.summary.spent)}
      </p></Card
    >
  </div>
  <Button href="/{data.locale}/dashboard/items"
    >{l(data.locale, 'Open campaigns', 'Kampagnen öffnen')} →</Button
  >
</main>
