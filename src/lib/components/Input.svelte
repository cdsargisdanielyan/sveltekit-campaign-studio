<script>
  /** @type {{id:string,label:string,name?:string,type?:string,value?:string,required?:boolean,autocomplete?:import('svelte/elements').HTMLInputAttributes['autocomplete'],placeholder?:string}} */
  let {
    id,
    label,
    name = id,
    type = 'text',
    value = $bindable(''),
    required = false,
    autocomplete,
    placeholder,
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
