<script>
  import '../app.css';
  import { onMount } from 'svelte';
  import { report } from '#lib/telemetry.js';
  /** @type {{children:import('svelte').Snippet}} */ let { children } =
    $props();
  onMount(async () => {
    if (Math.random() > 0.2) return;
    const { onCLS, onINP, onLCP, onTTFB } = await import('web-vitals');
    for (const observe of [onCLS, onINP, onLCP, onTTFB])
      observe((metric) =>
        report({ kind: 'vital', name: metric.name, value: metric.value }),
      );
  });
</script>

<a href="#main" class="skip-link">Skip to content</a>
<svelte:boundary
  onerror={(error) =>
    report({
      kind: 'error',
      name: 'render',
      message: error instanceof Error ? error.message : 'Render failure',
    })}
>
  {@render children()}
  {#snippet failed(_error, reset)}<main id="main" class="container section">
      <h1 class="page-heading">This view could not be displayed.</h1>
      <p class="muted my-6">
        Try loading it again. Your saved changes are safe.
      </p>
      <button class="button" onclick={reset}>Try again</button>
    </main>{/snippet}
</svelte:boundary>
