<script lang="ts">
  let {
    id,
    label,
    name = id,
    value = $bindable(''),
    options,
  }: {
    id: string;
    label: string;
    name?: string;
    value?: string;
    options: { value: string; label: string }[];
  } = $props();
</script>

<div>
  <label class="label" for={id}>{label}</label><select
    class="field"
    {id}
    {name}
    bind:value
    >{#each options as option (option.value)}<option value={option.value}
        >{option.label}</option
      >{/each}</select
  >
</div>
