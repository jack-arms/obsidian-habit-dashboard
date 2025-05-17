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
    <h4
      class="flex flex-row items-center space-x-2 m-0! mb-1! {habitProgressLastMonth.times >
      0
        ? 'text-gray-200'
        : ''}"
    >
      <History />
      <span>In the last 30 days:</span>
    </h4>
    <div class="flex flex-row space-x-2">
      <Badge color="purple" class="text-sm p-2 rounded-lg">
        {habitProgressLastMonth.times} times</Badge
      >
      {#if habitProgressLastMonth.minutes > 0}
        <Badge color="purple" class="text-sm p-2 rounded-lg">
          {formatMinutes(habitProgressLastMonth.minutes)}
        </Badge>
      {/if}
      {#each Object.entries(habitProgressLastMonth.progress) as [unit, value]}
        <Badge color="purple" class="text-sm p-2 rounded-lg"
          >{value} {unit}</Badge
        >
      {/each}
    </div>
  </div>
{/if}
