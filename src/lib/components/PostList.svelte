<script>
  import { page as route } from '$app/state';
  import { date, t, localized as l } from '#lib/i18n/index.js';
  import { queryLink } from '#lib/query.js';
  import Badge from './Badge.svelte';
  /** @type {{result:ReturnType<typeof import('../server/blog.js').findPosts>,locale:'en'|'de'}} */ let {
    result,
    locale,
  } = $props();
</script>

{#if !result.posts.length}<div class="card my-8">
    <h2 class="text-xl font-semibold">{t(locale, 'search.noResults')}</h2>
    <a class="text-link inline-block mt-4" href="/{locale}/search"
      >{l(locale, 'Clear filters', 'Filter zurücksetzen')}</a
    >
  </div>{/if}
<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 my-10">
  {#each result.posts as post (post.id)}<article class="post-card">
      <a href="/{locale}/blog/{post.slug}" class="block"
        ><div
          class="cover"
          style:background={post.coverColor}
          aria-hidden="true"
        >
          <span>campaign<br />journal<span class="arrow">↗</span></span>
          <div class="cover-orbit"></div>
        </div>
        <div class="p-6">
          <div class="flex gap-2 mb-4">
            <Badge>{post.tags[0]}</Badge><span class="text-xs muted self-center"
              >{t(locale, 'blog.readingTime', {
                minutes: post.readingTimeMinutes,
              })}</span
            >
          </div>
          <h2 class="text-xl font-semibold leading-snug tracking-tight">
            {post.translations[locale].title}
          </h2>
          <p class="muted text-sm leading-relaxed mt-3 line-clamp-3">
            {post.translations[locale].excerpt}
          </p>
          <div class="flex items-center gap-3 mt-6">
            <span
              class="avatar"
              style:background={post.author.avatarColor}
              aria-hidden="true"
              >{post.author.name
                .split(' ')
                .map((part) => part[0])
                .join('')}</span
            >
            <div class="text-xs">
              <p class="font-semibold">{post.author.name}</p>
              <time class="muted" datetime={post.publishedAt}
                >{date(locale, post.publishedAt)}</time
              >
            </div>
          </div>
        </div></a
      >
    </article>{/each}
</div>
<nav
  class="flex items-center justify-between gap-4 py-5 border-t border-line"
  aria-label={l(locale, 'Post pagination', 'Beitragsseiten')}
>
  {#if result.page > 1}<a
      class="button secondary"
      href={queryLink(route.url, { page: String(result.page - 1) })}
      >← {l(locale, 'Previous', 'Zurück')}</a
    >{:else}<span></span>{/if}<span class="text-sm muted"
    >{result.page} / {result.pages}</span
  >{#if result.page < result.pages}<a
      class="button secondary"
      href={queryLink(route.url, { page: String(result.page + 1) })}
      >{l(locale, 'Next', 'Weiter')} →</a
    >{:else}<span></span>{/if}
</nav>

<style>
  .post-card {
    border: 1px solid var(--line);
    background: var(--surface);
    border-radius: var(--radius-panel);
    overflow: hidden;
  }
  .cover {
    height: 190px;
    position: relative;
    overflow: hidden;
    padding: 28px;
    color: white;
  }
  .cover > span {
    font-size: 30px;
    line-height: 1.05;
    letter-spacing: -0.045em;
    font-weight: 600;
    position: relative;
    z-index: 1;
  }
  .arrow {
    position: absolute;
    left: 190px;
    top: 6px;
    font-size: 44px;
  }
  .cover-orbit {
    position: absolute;
    width: 220px;
    height: 220px;
    border: 1px solid #ffffff50;
    border-radius: 50%;
    bottom: -125px;
    right: -20px;
    box-shadow:
      0 0 0 35px #ffffff12,
      0 0 0 70px #ffffff0c;
  }
  .avatar {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    color: white;
    font-size: 10px;
    font-weight: 700;
  }
</style>
