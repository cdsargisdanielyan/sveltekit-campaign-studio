<script lang="ts">
  import type { PageData } from './$types';
  import * as env from '$app/env/public';
  import { t, localized as l } from '#lib/i18n/index.ts';
  import Seo from '#lib/components/Seo.svelte';
  import Container from '#lib/components/Container.svelte';
  import Button from '#lib/components/Button.svelte';
  import Card from '#lib/components/Card.svelte';
  let { data }: { data: PageData } = $props();
  const features = [
    [
      '01',
      'One clear view.',
      'Ein klarer Überblick.',
      'Every campaign, every channel. Find what matters without opening another tab.',
      'Alle Kampagnen und Kanäle. Finde das Wesentliche ohne einen weiteren Tab.',
    ],
    [
      '02',
      'Your team, in sync.',
      'Dein Team, im Einklang.',
      'Make considered changes with role-based access and an interface that keeps up.',
      'Durchdachte Änderungen mit rollenbasiertem Zugriff und einer schnellen Oberfläche.',
    ],
    [
      '03',
      'Fast by design.',
      'Von Grund auf schnell.',
      'A focused workspace that spends less time loading and more time moving you forward.',
      'Ein fokussierter Arbeitsbereich mit weniger Wartezeit und mehr Fortschritt.',
    ],
  ] as const;
  const jsonld = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Campaign Studio',
    url: env.PUBLIC_SITE_URL || 'http://localhost:4173',
  }).replaceAll('<', '\\u003c');
</script>

<Seo
  title={t(data.locale, 'home.hero.title')}
  description={t(data.locale, 'home.hero.subtitle')}
  locale={data.locale}
/>
<svelte:head
  ><!-- eslint-disable-next-line svelte/no-at-html-tags -- Serialized JSON-LD escapes less-than characters. -->
  {@html `<script type="application/ld+json">${jsonld}</${'script'}>`}</svelte:head
>
<main id="main">
  <Container
    ><section class="hero">
      <div>
        <p class="eyebrow mb-6">
          {l(
            data.locale,
            'Less busywork. More possibility.',
            'Weniger Routine. Mehr Möglichkeiten.',
          )}
        </p>
        <h1 class="text-display font-semibold max-w-[800px]">
          {l(
            data.locale,
            'Good campaigns start with a clear view.',
            'Gute Kampagnen beginnen mit Klarheit.',
          )}
        </h1>
        <p class="muted mt-7 text-lg max-w-[540px] leading-relaxed">
          {l(
            data.locale,
            'Bring your campaigns, channels, and team into one calm workspace. Built for the way you actually work.',
            'Kampagnen, Kanäle und Team in einem ruhigen Arbeitsbereich. Für deine tatsächliche Arbeitsweise.',
          )}
        </p>
        <div class="flex flex-wrap gap-3 mt-8">
          <Button href="/{data.locale}/login"
            >{t(data.locale, 'home.hero.cta')}
            <span aria-hidden="true">↗</span></Button
          ><Button href="/{data.locale}/blog" variant="secondary"
            >{l(data.locale, 'Read our journal', 'Unser Journal lesen')}</Button
          >
        </div>
        <p class="text-xs muted mt-5">
          {l(
            data.locale,
            'Explore the demo · No credit card required',
            'Demo erkunden · Keine Kreditkarte erforderlich',
          )}
        </p>
      </div>
      <div class="hero-preview grid-lines" aria-hidden="true">
        <div class="preview-window">
          <div class="flex justify-between mb-6">
            <span class="text-sm font-semibold">Campaign overview</span><span
              class="badge">Live workspace</span
            >
          </div>
          <div class="preview-number">
            {data.campaignCount}<span
              >{l(
                data.locale,
                ' campaigns, one home',
                ' Kampagnen, ein Ort',
              )}</span
            >
          </div>
          <div class="bars">
            {#each [35, 52, 43, 70, 56, 81, 67, 90, 76, 100, 83, 95] as height, i (i)}<div
                style:height={`${height}%`}
              ></div>{/each}
          </div>
          <div class="preview-row">
            <span>Summer launch</span><span class="badge" data-status="active"
              >● Active</span
            ><span>↗ 24.8%</span>
          </div>
          <div class="preview-row">
            <span>Product newsletter</span><span class="badge">Scheduled</span
            ><span>↗ 18.2%</span>
          </div>
        </div>
        <div class="floating-note">✓ &nbsp; A little more clarity.</div>
      </div>
    </section></Container
  >
  <div class="border-y border-line bg-surface py-8">
    <Container
      ><div class="social-proof">
        <p class="text-xs muted max-w-40">
          {l(
            data.locale,
            'A workspace for teams with good things to share.',
            'Für Teams, die Gutes zu teilen haben.',
          )}
        </p>
        <span>◈ Layers</span><span>Quotient</span><span>⌘ Circooles</span><span
          >✳ Sisyphus</span
        >
      </div>
      <p class="sr-only">
        {l(
          data.locale,
          'Illustrative demo brand names.',
          'Illustrative Demo-Markennamen.',
        )}
      </p></Container
    >
  </div>
  <Container
    ><section class="section">
      <div class="max-w-xl">
        <p class="eyebrow mb-4">{t(data.locale, 'home.features.title')}</p>
        <h2 class="text-3xl md:text-4xl font-semibold tracking-tight">
          {l(
            data.locale,
            'Room for the work that matters.',
            'Raum für die wichtige Arbeit.',
          )}
        </h2>
      </div>
      <div class="grid gap-5 md:grid-cols-3 mt-10">
        {#each features as f (f[0])}<Card
            ><span class="feature-number">{f[0]}</span>
            <h3 class="text-xl font-semibold mt-8 mb-3">
              {l(data.locale, f[1], f[2])}
            </h3>
            <p class="muted leading-relaxed">
              {l(data.locale, f[3], f[4])}
            </p></Card
          >{/each}
      </div>
    </section>
    <section id="pricing" class="section pt-0">
      <div class="pricing">
        <div>
          <p class="eyebrow mb-4">{t(data.locale, 'nav.pricing')}</p>
          <h2 class="text-3xl font-semibold max-w-md">
            {l(
              data.locale,
              'Start simple. Stay focused.',
              'Einfach starten. Fokussiert bleiben.',
            )}
          </h2>
          <p class="muted mt-4 max-w-md">
            {l(
              data.locale,
              'This assessment workspace is free to explore. Sign in with a demo account and make yourself at home.',
              'Dieser Demo-Arbeitsbereich ist kostenlos. Melde dich mit einem Demo-Konto an.',
            )}
          </p>
        </div>
        <div class="card min-w-64">
          <p class="font-semibold">Studio demo</p>
          <p class="text-5xl font-semibold my-4">
            $0<span class="text-sm muted font-normal"> / demo</span>
          </p>
          <p class="muted text-sm mb-6">
            {l(
              data.locale,
              'All channels. Three account roles.',
              'Alle Kanäle. Drei Kontorollen.',
            )}
          </p>
          <Button href="/{data.locale}/login"
            >{l(data.locale, 'Explore workspace', 'Arbeitsbereich erkunden')} ↗</Button
          >
        </div>
      </div>
    </section></Container
  >
</main>

<style>
  .hero {
    display: grid;
    grid-template-columns: 1.15fr 1fr;
    align-items: center;
    gap: 48px;
    padding: 90px 0 100px;
  }
  .hero-preview {
    position: relative;
    min-height: 450px;
    display: grid;
    place-items: center;
    border-radius: 24px;
    background-color: var(--soft);
    padding: 28px;
  }
  .preview-window {
    background: var(--surface);
    border: 1px solid var(--line);
    border-radius: 16px;
    padding: 26px;
    width: 100%;
    box-shadow: 0 24px 50px #18213112;
    transform: rotate(-3deg);
  }
  .preview-number {
    font-size: 44px;
    font-weight: 650;
    letter-spacing: -0.05em;
  }
  .preview-number span {
    font-size: 12px;
    color: var(--muted);
    font-weight: 400;
    letter-spacing: 0;
  }
  .bars {
    height: 130px;
    display: flex;
    align-items: end;
    gap: 8px;
    margin: 25px 0;
  }
  .bars div {
    flex: 1;
    background: var(--accent);
    opacity: 0.75;
    border-radius: 4px 4px 0 0;
  }
  .bars div:nth-child(2n) {
    opacity: 0.35;
  }
  .preview-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    font-size: 11px;
    border-top: 1px solid var(--line);
    padding: 14px 0;
  }
  .floating-note {
    position: absolute;
    bottom: 12px;
    right: 8px;
    border: 1px solid var(--line);
    border-radius: 12px;
    background: var(--surface);
    padding: 16px 24px;
    font-size: 13px;
    box-shadow: 0 8px 24px #0001;
  }
  .social-proof {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 28px;
    flex-wrap: wrap;
  }
  .social-proof > span {
    font-size: 24px;
    font-weight: 650;
    letter-spacing: -0.04em;
    color: var(--muted);
  }
  .feature-number {
    background: var(--soft);
    color: var(--accent);
    border-radius: 10px;
    padding: 12px;
    font-size: 12px;
    font-weight: 700;
  }
  .pricing {
    background: var(--soft);
    border: 1px solid var(--line);
    border-radius: 24px;
    padding: 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 32px;
  }
  @media (max-width: 950px) {
    .hero {
      grid-template-columns: 1fr;
      padding: 60px 0;
      gap: 40px;
    }
    .hero-preview {
      min-height: 360px;
    }
    .pricing {
      flex-wrap: wrap;
      padding: 28px;
    }
  }
</style>
