<script lang="ts">
  import type { Snippet } from 'svelte';
  let { children, status }: { children: Snippet; status?: string } = $props();
</script>

<span class="badge" data-status={status}>{@render children()}</span>
