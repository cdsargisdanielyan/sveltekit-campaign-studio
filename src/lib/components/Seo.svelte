<script>
  import { page } from '$app/state';
  import * as env from '$app/env/public';
  /** @type {{title:string,description:string,locale?:'en'|'de',image?:string,noindex?:boolean}} */
  let { title, description, locale = 'en', image, noindex = false } = $props();
  const origin = env.PUBLIC_SITE_URL || 'http://localhost:4173';
  let path = $derived(page.url.pathname);
  let canonical = $derived(`${origin}${path}`);
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
      href={`${origin}${path.replace(/^\/(en|de)/, '/en')}`}
    /><link
      rel="alternate"
      hreflang="de"
      href={`${origin}${path.replace(/^\/(en|de)/, '/de')}`}
    /><link
      rel="alternate"
      hreflang="x-default"
      href={`${origin}${path.replace(/^\/(en|de)/, '/en')}`}
    />
  {/if}
</svelte:head>
