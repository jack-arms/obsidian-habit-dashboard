<script lang="ts">
  import type { GoalIntervalTimeUnit, HabitTimeProgressUnit } from "src/types";
  import CircularProgress from "./CircularProgress.svelte";
  import type { Snippet } from "svelte";

  interface Props {
    goal: number;
    goalUnit: HabitTimeProgressUnit | string | null;
    interval: number;
    intervalTimeUnit: GoalIntervalTimeUnit;
    goalProgress: number;
    stroke: number;
    progressComponent: Snippet<[goalProgress: number]>;
  }

  let { goal, goalProgress, stroke = 12, progressComponent }: Props = $props();

  let progressPercent = $derived((goalProgress * 100.0) / goal);

  const percentProgressToStrokeColor = (progressPercent: number) => {
    if (progressPercent >= 100) {
      return "stroke-green-600";
    } else if (progressPercent > 80) {
      return "stroke-green-500";
    } else if (progressPercent > 50) {
      return "stroke-yellow-300";
    } else if (progressPercent > 30) {
      return "stroke-yellow-400";
    } else if (progressPercent > 20) {
      return "stroke-yellow-500";
    } else {
      return "stroke-red-500";
    }
  };
</script>

<CircularProgress
  progress={progressPercent}
  {stroke}
  circleClass={percentProgressToStrokeColor(progressPercent)}
>
  {#snippet children()}
    {@render progressComponent(goalProgress)}
  {/snippet}
</CircularProgress>
