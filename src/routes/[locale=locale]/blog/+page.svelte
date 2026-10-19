<script>
  import Container from '#lib/components/Container.svelte';
  import Heading from '#lib/components/Heading.svelte';
  import Seo from '#lib/components/Seo.svelte';
  import PostList from '#lib/components/PostList.svelte';
  import { t, localized as l } from '#lib/i18n/index.js';
  /** @type {{data:import('./$types').PageData}} */ let { data } = $props();
</script>

<Seo
  title={t(data.locale, 'blog.title')}
  description={l(
    data.locale,
    'Notes on building a faster, more thoughtful web.',
    'Notizen über ein schnelleres, durchdachteres Web.',
  )}
  locale={data.locale}
/>
<main id="main" class="section">
  <Container
    ><Heading eyebrow="The studio journal"
      >{l(
        data.locale,
        'Ideas worth making room for.',
        'Ideen, die Raum verdienen.',
      )}</Heading
    >
    <p class="muted text-lg mt-5">
      {l(
        data.locale,
        'Engineering, design, and the craft of building better.',
        'Entwicklung, Design und die Kunst, besser zu bauen.',
      )}
    </p>
    <PostList result={data.result} locale={data.locale} /></Container
  >
</main>
