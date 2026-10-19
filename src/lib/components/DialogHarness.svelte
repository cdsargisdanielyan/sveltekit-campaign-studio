<script>
  import Dialog from './Dialog.svelte';
  let open = $state(false);
</script>

<button onclick={() => (open = true)}>Open guide</button>
<Dialog bind:open title="Workspace guide" description="Explore the workspace"
  ><button>First action</button><button>Last action</button></Dialog
>
