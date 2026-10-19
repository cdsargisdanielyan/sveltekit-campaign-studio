<script>
  /** @type {{children:import('svelte').Snippet}} */ let { children } =
    $props();
</script>

<div class="container">{@render children()}</div>
