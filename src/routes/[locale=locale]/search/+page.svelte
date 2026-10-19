<script lang="ts">
  import type { PageData } from './$types';
  import Container from '#lib/components/Container.svelte';
  import Heading from '#lib/components/Heading.svelte';
  import Seo from '#lib/components/Seo.svelte';
  import PostList from '#lib/components/PostList.svelte';
  import { t, localized as l } from '#lib/i18n/index.ts';
  let { data }: { data: PageData } = $props();
</script>

<Seo
  canonicalQuery={data.canonicalQuery}
  title={t(data.locale, 'nav.search')}
  description={t(data.locale, 'search.placeholder')}
  locale={data.locale}
/>
<main id="main" class="section">
  <Container
    ><Heading eyebrow="The studio journal"
      >{l(
        data.locale,
        'Find your next good read.',
        'Finde deinen nächsten guten Beitrag.',
      )}</Heading
    >
    <form
      method="GET"
      class="card grid gap-4 md:grid-cols-[2fr_1fr_1fr_auto] items-end mt-8"
    >
      <div>
        <label class="label" for="q">{t(data.locale, 'nav.search')}</label
        ><input
          class="field"
          id="q"
          name="q"
          value={data.result.q}
          placeholder={t(data.locale, 'search.placeholder')}
        />
      </div>
      <div>
        <label class="label" for="tag">{l(data.locale, 'Topic', 'Thema')}</label
        ><select class="field" id="tag" name="tag" value={data.result.tag}
          ><option value=""
            >{l(data.locale, 'All topics', 'Alle Themen')}</option
          >{#each data.tags as tag (tag.slug)}<option value={tag.slug}
              >{tag.label[data.locale]}</option
            >{/each}</select
        >
      </div>
      <div>
        <label class="label" for="sort"
          >{l(data.locale, 'Sort by', 'Sortieren')}</label
        ><select class="field" id="sort" name="sort" value={data.result.sort}
          ><option value="newest"
            >{l(data.locale, 'Newest first', 'Neueste zuerst')}</option
          ><option value="oldest"
            >{l(data.locale, 'Oldest first', 'Älteste zuerst')}</option
          ></select
        >
      </div>
      <button class="button">{t(data.locale, 'nav.search')}</button>
    </form>
    <p class="muted text-sm mt-6" role="status">
      {t(data.locale, 'search.results', {
        count: data.result.total,
        query: data.result.q,
      })}
    </p>
    <PostList result={data.result} locale={data.locale} /></Container
  >
</main>
