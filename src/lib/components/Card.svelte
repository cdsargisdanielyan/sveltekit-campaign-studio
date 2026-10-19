<script>
  /** @type {{children:import('svelte').Snippet}} */ let { children } =
    $props();
</script>

<div class="card">{@render children()}</div>
