<script lang="ts">
  import { formatMinutes } from "src/utils/utils";
  import { Badge } from "flowbite-svelte";
  import type { AggregatedHabitProgress } from "src/types";

  interface Props {
    habitProgress: AggregatedHabitProgress;
  }

  let { habitProgress } = $props();
</script>

<div class="flex flex-row space-x-2">
  <Badge
    class="text-sm p-2 rounded-lg {habitProgress.times > 0
      ? 'bg-(--background-modifier-active-hover) text-(--text-accent)'
      : 'bg-(--background-modifier-hover) text-(--text-normal)'}"
  >
    {habitProgress.times} times
  </Badge>
  {#if habitProgress.minutes > 0}
    <Badge
      class="text-sm p-2 rounded-lg bg-(--background-modifier-active-hover) text-(--text-accent)"
    >
      {formatMinutes(habitProgress.minutes)}
    </Badge>
  {/if}
  {#each Object.entries(habitProgress.progress) as [unit, value]}
    <Badge
      class="text-sm p-2 rounded-lg bg-(--background-modifier-active-hover) text-(--text-accent)"
    >
      {value}
      {unit}
    </Badge>
  {/each}
</div>
