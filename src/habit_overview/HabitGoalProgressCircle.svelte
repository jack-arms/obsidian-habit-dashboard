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
    svgClass?: string | null;
  }

  let {
    goal,
    goalProgress,
    stroke = 12,
    progressComponent,
    svgClass = null,
  }: Props = $props();

  let progressPercent = $derived((goalProgress * 100.0) / goal);
</script>

<CircularProgress
  progress={progressPercent}
  {stroke}
  {svgClass}
  circleClass="stroke-(--color-accent)"
>
  {#snippet children()}
    {@render progressComponent(goalProgress)}
  {/snippet}
</CircularProgress>
