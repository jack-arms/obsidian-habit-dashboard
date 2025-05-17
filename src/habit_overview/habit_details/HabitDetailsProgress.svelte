<script lang="ts">
  import type { HabitDayProgress } from "src/types";
  import { moment } from "obsidian";
  import { getAggregatedHabitProgress } from "src/utils/habitDataUtils";
  import { latestHabitProgress, formatMinutes } from "src/utils/utils";
  import { Badge } from "flowbite-svelte";
  import { History } from "lucide-svelte";

  interface Props {
    habitProgress: {
      [date: string]: HabitDayProgress;
    };
  }

  let { habitProgress } = $props();

  let habitProgressLastMonth = $derived(
    getAggregatedHabitProgress(habitProgress, moment().subtract(1, "month")),
  );
  let latestProgress = $derived(
    latestHabitProgress(Object.values(habitProgress)),
  );
</script>

{#if latestProgress != null}
  <div class="flex flex-col items-start space-x-2">
    <span
      class="flex flex-row items-center space-x-2 m-0! mb-1! font-bold {habitProgressLastMonth.times ===
      0
        ? 'text-gray-200'
        : 'text-gray-900'}"
    >
      <History />
      <span>In the last 30 days:</span>
    </span>
    <div class="flex flex-row space-x-2">
      <Badge
        class="text-sm p-2 rounded-lg bg-(--background-modifier-active-hover) text-(--text-accent)"
      >
        {habitProgressLastMonth.times} times</Badge
      >
      {#if habitProgressLastMonth.minutes > 0}
        <Badge
          class="text-sm p-2 rounded-lg bg-(--background-modifier-active-hover) text-(--text-accent)"
        >
          {formatMinutes(habitProgressLastMonth.minutes)}
        </Badge>
      {/if}
      {#each Object.entries(habitProgressLastMonth.progress) as [unit, value]}
        <Badge
          class="text-sm p-2 rounded-lg bg-(--background-modifier-active-hover) text-(--text-accent)"
        >
          {value}
          {unit}
        </Badge>
      {/each}
    </div>
  </div>
{/if}
