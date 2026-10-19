<script>
  /** @type {{children:import('svelte').Snippet,eyebrow?:string}} */ let {
    children,
    eyebrow,
  } = $props();
</script>

{#if eyebrow}<p class="eyebrow mb-3">{eyebrow}</p>{/if}
<h1 class="page-heading">{@render children()}</h1>
