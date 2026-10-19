<script>
  import { tick } from 'svelte';
  /** @type {{open?:boolean,title:string,description:string,children:import('svelte').Snippet}} */
  let { open = $bindable(false), title, description, children } = $props();
  /** @type {HTMLDivElement | undefined} */ let panel = $state();
  const uid = $props.id();
  $effect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    tick().then(() => panel?.querySelector('button')?.focus());
    return () => {
      document.body.style.overflow = overflow;
      if (previous instanceof HTMLElement) previous.focus();
    };
  });
  /** @param {KeyboardEvent} event */
  function onkeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      open = false;
    }
    if (event.key !== 'Tab') return;
    const nodes = panel?.querySelectorAll(
      'button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),[tabindex="0"]',
    );
    if (!nodes?.length) {
      event.preventDefault();
      return;
    }
    const first = nodes[0],
      last = nodes[nodes.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      if (last instanceof HTMLElement) last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      if (first instanceof HTMLElement) first.focus();
    }
  }
</script>

{#if open}
  <div class="backdrop" role="presentation">
    <div
      class="dialog card"
      role="dialog"
      aria-modal="true"
      aria-labelledby="{uid}-title"
      aria-describedby="{uid}-description"
      tabindex="-1"
      bind:this={panel}
      {onkeydown}
    >
      <button
        class="close button ghost"
        aria-label="Close dialog"
        onclick={() => (open = false)}>×</button
      >
      <h2 id="{uid}-title" class="text-xl font-semibold pr-12">{title}</h2>
      <p id="{uid}-description" class="muted mt-3 mb-6">{description}</p>
      {@render children()}
    </div>
  </div>
{/if}

<style>
  .backdrop {
    position: fixed;
    inset: 0;
    z-index: 80;
    background: #070c2099;
    display: grid;
    place-items: center;
    padding: 24px;
  }
  .dialog {
    width: min(100%, 500px);
    position: relative;
    max-height: 85vh;
    overflow: auto;
  }
  .close {
    position: absolute;
    right: 12px;
    top: 12px;
    font-size: 24px;
  }
</style>
