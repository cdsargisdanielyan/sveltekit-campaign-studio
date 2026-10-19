<script lang="ts">
  import { page } from '$app/state';
</script>

<svelte:head
  ><title>{page.status} · Campaign Studio</title><meta
    name="robots"
    content="noindex"
  /><meta
    name="description"
    content="The requested page is unavailable."
  /></svelte:head
>
<main id="main" class="container section">
  <p class="eyebrow">{page.status}</p>
  <h1 class="text-4xl font-semibold mt-6">
    {page.status === 404
      ? 'A little off the beaten path.'
      : 'Something interrupted this view.'}
  </h1>
  <p class="muted mt-5 mb-8">
    {page.status === 404
      ? 'This page could not be found. Let’s get you back to familiar ground.'
      : page.error?.message}
  </p>
  <a class="button" href="/en">Return home →</a>
</main>
