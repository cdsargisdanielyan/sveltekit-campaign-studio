<script>
  import * as env from '$app/env/public';
  import Seo from '#lib/components/Seo.svelte';
  import { date, t, localized as l } from '#lib/i18n/index.js';
  /** @type {{data:import('./$types').PageData}} */ let { data } = $props();
  let post = $derived(data.post);
  let text = $derived(post.translations[data.locale]);
  let origin = env.PUBLIC_SITE_URL || 'http://localhost:4173';
  let schema = $derived(
    JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Article',
          headline: text.title,
          description: text.excerpt,
          datePublished: post.publishedAt,
          author: { '@type': 'Person', name: post.author.name },
          image: `${origin}/api/og?slug=${post.slug}&locale=${data.locale}`,
          mainEntityOfPage: `${origin}/${data.locale}/blog/${post.slug}`,
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: `${origin}/${data.locale}`,
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Blog',
              item: `${origin}/${data.locale}/blog`,
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: text.title,
              item: `${origin}/${data.locale}/blog/${post.slug}`,
            },
          ],
        },
      ],
    }).replaceAll('<', '\\u003c'),
  );
</script>

<Seo
  title={text.title}
  description={text.excerpt}
  locale={data.locale}
  image={`${origin}/api/og?slug=${post.slug}&locale=${data.locale}`}
/>
<svelte:head
  ><!-- eslint-disable-next-line svelte/no-at-html-tags -- Serialized JSON-LD escapes less-than characters. -->
  {@html `<script type="application/ld+json">${schema}</${'script'}>`}</svelte:head
>
<main id="main" class="section">
  <article class="mx-auto max-w-[760px] px-gutter">
    <a class="text-link text-sm" href="/{data.locale}/blog"
      >← {l(data.locale, 'Back to journal', 'Zurück zum Journal')}</a
    >
    <p class="eyebrow mt-10 mb-5">{post.tags.join(' / ')}</p>
    <h1 class="text-4xl md:text-5xl font-semibold leading-tight tracking-tight">
      {text.title}
    </h1>
    <p class="muted text-xl leading-relaxed mt-6">{text.excerpt}</p>
    <div
      class="flex gap-3 text-sm muted py-8 mt-4 border-b border-line flex-wrap"
    >
      <span class="font-semibold text-ink">{post.author.name}</span><time
        datetime={post.publishedAt}>{date(data.locale, post.publishedAt)}</time
      ><span
        >· {t(data.locale, 'blog.readingTime', {
          minutes: post.readingTimeMinutes,
        })}</span
      >
    </div>
    <div class="article-body">
      {#each text.body.split('\n\n') as paragraph, i (i)}<p>
          {paragraph}
        </p>{/each}
    </div>
    <aside class="card mt-12">
      <h2 class="text-xl font-semibold">
        {l(
          data.locale,
          'Make room for better work.',
          'Raum für bessere Arbeit.',
        )}
      </h2>
      <p class="muted mt-3 mb-5">
        {l(
          data.locale,
          'Explore the workspace behind the journal.',
          'Entdecke den Arbeitsbereich hinter dem Journal.',
        )}
      </p>
      <a class="text-link" href="/{data.locale}/login"
        >{t(data.locale, 'home.hero.cta')} ↗</a
      >
    </aside>
  </article>
</main>
