<script>
  /** @type {{children:import('svelte').Snippet,status?:string}} */ let {
    children,
    status,
  } = $props();
</script>

<span class="badge" data-status={status}>{@render children()}</span>
