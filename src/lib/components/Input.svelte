<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  let {
    id,
    label,
    name = id,
    type = 'text',
    value = $bindable(''),
    required = false,
    autocomplete,
    placeholder,
  }: {
    id: string;
    label: string;
    name?: string;
    type?: string;
    value?: string;
    required?: boolean;
    autocomplete?: HTMLInputAttributes['autocomplete'];
    placeholder?: string;
  } = $props();
</script>

<div>
  <label class="label" for={id}>{label}</label><input
    class="field"
    {id}
    {name}
    {type}
    bind:value
    {required}
    {autocomplete}
    {placeholder}
  />
</div>
