<script lang="ts">
  import type { HabitDayProgress } from "src/types";
  import { moment } from "obsidian";
  import { getAggregatedHabitProgress } from "src/utils/habitDataUtils";
  import { latestHabitProgress, formatMinutes } from "src/utils/utils";
  import HabitTimeSinceBadge from "../HabitTimeSinceBadge.svelte";
  import { Badge, Tooltip } from "flowbite-svelte";

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
  <div class="flex flex-col space-y-2">
    <div class="flex flex-col items-start">
      <h4 class="m-0! mb-1!">Last done</h4>
      <HabitTimeSinceBadge
        date={latestProgress.date}
        daysSince={moment().diff(moment(latestProgress.date), "days")}
      />
    </div>

    {#if habitProgressLastMonth.times > 0}
      <div class="flex flex-col items-start space-x-2">
        <h4 class="m-0! mb-1!">In the last 30 days</h4>
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
  </div>
{/if}
