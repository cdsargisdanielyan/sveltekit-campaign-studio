<script lang="ts">
  import type { Snippet } from 'svelte';
  let { children, eyebrow }: { children: Snippet; eyebrow?: string } = $props();
</script>

{#if eyebrow}<p class="eyebrow mb-3">{eyebrow}</p>{/if}
<h1 class="page-heading">{@render children()}</h1>
