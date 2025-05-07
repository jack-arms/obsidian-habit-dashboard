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
</script>

<CircularProgress
  progress={progressPercent}
  {stroke}
  circleClass="stroke-(--color-accent)"
>
  {#snippet children()}
    {@render progressComponent(goalProgress)}
  {/snippet}
</CircularProgress>
