<script lang="ts">
  let { label }: { label: string } = $props();
</script>

<div aria-busy="true" aria-label={label} class="card">
  <span class="sr-only" role="status">{label}</span
  >{#each Array(10) as _, i (i)}<div class="skeleton"></div>{/each}
</div>

<style>
  .skeleton {
    height: 46px;
    border-bottom: 1px solid var(--line);
    background: linear-gradient(
      90deg,
      var(--soft),
      var(--surface),
      var(--soft)
    );
    background-size: 200% 100%;
    animation: shimmer 1.6s linear infinite;
  }
  @keyframes shimmer {
    to {
      background-position: -200% 0;
    }
  }
</style>
