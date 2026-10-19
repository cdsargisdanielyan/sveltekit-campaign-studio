<script>
  /** @type {{children:import('svelte').Snippet, href?:string, variant?:'primary'|'secondary'|'ghost', type?:'button'|'submit', disabled?:boolean, onclick?: (event:MouseEvent)=>void}} */
  let {
    children,
    href,
    variant = 'primary',
    type = 'button',
    disabled = false,
    onclick,
  } = $props();
</script>

{#if href}<a class="button {variant}" {href}>{@render children()}</a>
{:else}<button class="button {variant}" {type} {disabled} {onclick}
    >{@render children()}</button
  >{/if}
