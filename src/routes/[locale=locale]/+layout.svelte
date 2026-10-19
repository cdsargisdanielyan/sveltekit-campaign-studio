<script>
  import { page } from '$app/state';
  import { building } from '$app/env';
  import { t, localized as l } from '#lib/i18n/index.js';
  import Container from '#lib/components/Container.svelte';
  /** @type {{data:import('./$types').LayoutData,children:import('svelte').Snippet}} */ let {
    data,
    children,
  } = $props();
  $effect(() => {
    document.documentElement.lang = data.locale;
  });
  let dashboard = $derived(page.url.pathname.includes('/dashboard'));
  let otherLocale = $derived(data.locale === 'en' ? 'de' : 'en');
  let otherUrl = $derived(
    page.url.pathname.replace(/^\/(en|de)/, `/${otherLocale}`) +
      (building ? '' : page.url.search),
  );
  function toggleTheme() {
    const root = document.documentElement;
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('theme', root.dataset.theme);
    } catch {
      /* Storage may be disabled. */
    }
  }
</script>

<header class="site-header">
  <Container
    ><div class="header-inner">
      <a href="/{data.locale}" class="brand"
        ><span class="brand-icon" aria-hidden="true">↗</span> campaign<span
          class="font-normal muted">studio</span
        ><span class="sr-only"> — {t(data.locale, 'nav.home')}</span></a
      >
      <nav
        aria-label={l(data.locale, 'Main navigation', 'Hauptnavigation')}
        class="flex items-center gap-5 text-sm font-medium"
      >
        <a href="/{data.locale}/blog">{t(data.locale, 'nav.blog')}</a><a
          href="/{data.locale}/search">{t(data.locale, 'nav.search')}</a
        >
        <a
          class="locale"
          href={otherUrl}
          hreflang={otherLocale}
          aria-label={l(
            data.locale,
            'DE — Switch to German',
            'EN — Zu Englisch wechseln',
          )}>{otherLocale.toUpperCase()}</a
        >
        <button
          class="theme"
          onclick={toggleTheme}
          aria-label={l(
            data.locale,
            'Toggle color theme',
            'Farbschema wechseln',
          )}>◐</button
        >
        {#if dashboard}<form method="POST" action="/logout">
            <button class="button secondary"
              >{t(data.locale, 'nav.logout')}</button
            >
          </form>{:else}<a class="button secondary" href="/{data.locale}/login"
            >{t(data.locale, 'nav.login')} <span aria-hidden="true">↗</span></a
          >{/if}
      </nav>
    </div></Container
  >
</header>
{#if dashboard}
  <div class="dashboard-shell">
    <aside class="sidebar">
      <p class="eyebrow mb-6">Workspace</p>
      <nav
        aria-label={l(data.locale, 'Workspace navigation', 'Arbeitsbereich')}
      >
        <a
          href="/{data.locale}/dashboard"
          aria-current={page.url.pathname.endsWith('/dashboard')
            ? 'page'
            : undefined}>◫ &nbsp; {t(data.locale, 'dashboard.title')}</a
        >
        <a
          href="/{data.locale}/dashboard/items"
          aria-current={page.url.pathname.includes('/items')
            ? 'page'
            : undefined}>▤ &nbsp; {t(data.locale, 'dashboard.items.title')}</a
        >
      </nav>
      <div class="workspace-note">
        <span class="status-dot"></span>
        {l(data.locale, 'Demo workspace', 'Demo-Arbeitsbereich')}
        <p>
          {l(
            data.locale,
            'Built for thoughtful teams.',
            'Für durchdachte Teams.',
          )}
        </p>
      </div>
    </aside>
    <div class="min-w-0">{@render children()}</div>
  </div>
{:else}{@render children()}
  <footer class="border-t border-line py-8">
    <Container
      ><div class="flex flex-wrap justify-between gap-4 text-sm muted">
        <span>{t(data.locale, 'footer.copy')} · Campaign Studio</span><span
          >{l(
            data.locale,
            'A little less friction. A lot more momentum.',
            'Weniger Reibung. Mehr Fortschritt.',
          )}</span
        >
      </div></Container
    >
  </footer>{/if}

<style>
  .site-header {
    background: var(--surface);
    border-bottom: 1px solid var(--line);
  }
  .header-inner {
    min-height: 88px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
    padding: 16px 0;
  }
  .brand {
    font-size: 20px;
    font-weight: 750;
    letter-spacing: -0.05em;
    display: flex;
    align-items: center;
    gap: 3px;
  }
  .brand-icon {
    display: grid;
    place-items: center;
    background: var(--accent);
    color: var(--accent-ink);
    width: 32px;
    height: 32px;
    border-radius: 10px;
    margin-right: 8px;
    font-size: 24px;
  }
  .theme {
    width: 36px;
    height: 36px;
    border: 1px solid var(--line);
    border-radius: 50%;
    font-size: 22px;
  }
  .locale {
    font-size: 12px;
  }
  .dashboard-shell {
    display: grid;
    grid-template-columns: 210px minmax(0, 1fr);
    max-width: 1600px;
    margin: auto;
    min-height: calc(100vh - 88px);
  }
  .sidebar {
    border-right: 1px solid var(--line);
    padding: 36px 24px;
    position: relative;
  }
  .sidebar nav {
    display: grid;
    gap: 8px;
  }
  .sidebar nav a {
    padding: 12px 14px;
    font-size: 14px;
    border-radius: 8px;
    color: var(--muted);
  }
  .sidebar nav a[aria-current] {
    color: var(--accent);
    background: var(--soft);
    font-weight: 650;
  }
  .workspace-note {
    font-size: 12px;
    margin-top: 80px;
    color: var(--muted);
    line-height: 2;
  }
  .status-dot {
    display: inline-block;
    background: var(--positive);
    height: 6px;
    width: 6px;
    border-radius: 50%;
    margin-right: 5px;
  }
  @media (max-width: 850px) {
    .dashboard-shell {
      grid-template-columns: 1fr;
    }
    .sidebar {
      border-right: 0;
      border-bottom: 1px solid var(--line);
      padding: 16px 24px;
    }
    .sidebar > p,
    .workspace-note {
      display: none;
    }
    .sidebar nav {
      display: flex;
    }
    .header-inner {
      justify-content: center;
    }
    nav {
      flex-wrap: wrap;
      justify-content: center;
      gap: 14px !important;
    }
  }
</style>
