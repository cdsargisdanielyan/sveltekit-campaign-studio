<script>
  /** @type {{message:string,error?:boolean}} */ let {
    message,
    error = false,
  } = $props();
</script>

{#if message}<div
    class="toast"
    class:failure={error}
    role={error ? 'alert' : 'status'}
  >
    {message}
  </div>{/if}

<style>
  .toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    max-width: min(440px, calc(100vw - 48px));
    padding: 16px 20px;
    border: 1px solid var(--positive);
    border-radius: var(--radius-control);
    background: var(--surface);
    box-shadow: 0 8px 32px #0002;
    z-index: 60;
  }
  .failure {
    border-color: var(--danger);
    color: var(--danger);
  }
</style>
