<script lang="ts">
  import type { HabitDayProgress } from "src/types";
  import { moment } from "obsidian";
  import { getAggregatedHabitProgress } from "src/utils/habitDataUtils";
  import { ChartColumnIncreasing, History } from "lucide-svelte";
  import HabitProgressBadges from "./HabitProgressBadges.svelte";
  import { getContext } from "svelte";

  interface Props {
    habitProgress: {
      [date: string]: HabitDayProgress;
    };
  }

  let { habitProgress } = $props();

  const dateFormat = getContext<string>("date-format");
  let habitProgressLastMonth = $derived(
    getAggregatedHabitProgress(
      habitProgress,
      dateFormat,
      moment().subtract(1, "month"),
    ),
  );
  let habitProgressAllTime = $derived(
    getAggregatedHabitProgress(habitProgress, dateFormat),
  );
</script>

<div class="flex flex-col space-y-4">
  <div class="flex flex-col space-y-2">
    <span class="flex flex-row items-center space-x-2 font-bold">
      <History />
      <span>Last 30 days</span>
    </span>
    <HabitProgressBadges habitProgress={habitProgressLastMonth} />
  </div>
  <div class="flex flex-col space-y-2">
    <span class="flex flex-row items-center space-x-2 font-bold">
      <ChartColumnIncreasing />
      <span>All time</span>
    </span>
    <HabitProgressBadges habitProgress={habitProgressAllTime} />
  </div>
</div>
