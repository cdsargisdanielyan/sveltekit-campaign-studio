<script lang="ts">
  import type { Snippet } from 'svelte';

  let {
    children,
    href,
    variant = 'primary',
    type = 'button',
    disabled = false,
    onclick,
  }: {
    children: Snippet;
    href?: string;
    variant?: 'primary' | 'secondary' | 'ghost';
    type?: 'button' | 'submit';
    disabled?: boolean;
    onclick?: (event: MouseEvent) => void;
  } = $props();
</script>

{#if href}<a class="button {variant}" {href}>{@render children()}</a>
{:else}<button class="button {variant}" {type} {disabled} {onclick}
    >{@render children()}</button
  >{/if}
