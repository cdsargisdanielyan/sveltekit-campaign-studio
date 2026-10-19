<script lang="ts">
  import type { Locale } from '#lib/contracts.ts';
  import { page } from '$app/state';
  import * as env from '$app/env/public';

  let {
    title,
    description,
    locale = 'en',
    image,
    noindex = false,
    canonicalQuery = '',
  }: {
    title: string;
    description: string;
    locale?: Locale;
    image?: string;
    noindex?: boolean;
    canonicalQuery?: string;
  } = $props();
  const origin = env.PUBLIC_SITE_URL || 'http://localhost:4173';
  let path = $derived(page.url.pathname);
  let canonical = $derived(`${origin}${path}${canonicalQuery}`);
  let og = $derived(image || `${origin}/og/default.svg`);
</script>

<svelte:head>
  <title>{title} · Campaign Studio</title><meta
    name="description"
    content={description}
  />
  <link rel="canonical" href={canonical} />
  <meta property="og:title" content={title} /><meta
    property="og:description"
    content={description}
  /><meta property="og:url" content={canonical} /><meta
    property="og:image"
    content={og}
  /><meta property="og:type" content={image ? 'article' : 'website'} /><meta
    property="og:locale"
    content={locale === 'en' ? 'en_US' : 'de_DE'}
  />
  <meta name="twitter:card" content="summary_large_image" /><meta
    name="twitter:title"
    content={title}
  /><meta name="twitter:description" content={description} /><meta
    name="twitter:image"
    content={og}
  />
  {#if noindex}<meta name="robots" content="noindex,nofollow" />{:else}
    <link
      rel="alternate"
      hreflang="en"
      href={`${origin}${path.replace(/^\/(en|de)/, '/en')}${canonicalQuery}`}
    /><link
      rel="alternate"
      hreflang="de"
      href={`${origin}${path.replace(/^\/(en|de)/, '/de')}${canonicalQuery}`}
    /><link
      rel="alternate"
      hreflang="x-default"
      href={`${origin}${path.replace(/^\/(en|de)/, '/en')}${canonicalQuery}`}
    />
  {/if}
</svelte:head>
