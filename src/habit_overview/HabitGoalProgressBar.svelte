<script lang="ts">
  import type { GoalIntervalTimeUnit, HabitTimeProgressUnit } from "src/types";
  import { goalIntervalTimeUnitToString } from "src/utils/utils";

  interface Props {
    goal: number;
    goalUnit: HabitTimeProgressUnit | string | null;
    interval: number;
    intervalTimeUnit: GoalIntervalTimeUnit;
    goalProgress: number;
  }

  let { goal, goalUnit, interval, intervalTimeUnit, goalProgress }: Props =
    $props();

  let progressPercent = $derived((goalProgress * 100.0) / goal);

  const percentProgressToBarColor = (progressPercent: number) => {
    if (progressPercent >= 100) {
      return "bg-green-600";
    } else if (progressPercent > 80) {
      return "bg-green-500";
    } else if (progressPercent > 50) {
      return "bg-yellow-300";
    } else if (progressPercent > 30) {
      return "bg-yellow-400";
    } else if (progressPercent > 20) {
      return "bg-yellow-500";
    } else {
      return "bg-red-500";
    }
  };
</script>

<div class="flex flex-col flex-grow items-center">
  <span class="text-sm font-semibold">
    {goalProgress} / {goal}{goalUnit ?? "X"}
  </span>
  <div class="border rounded-sm overflow-hidden w-full">
    <div
      class="goal-bar bg-gray-200 w-full h-3 {percentProgressToBarColor(
        progressPercent,
      )}"
      style="--percentGoal:{Math.min(progressPercent, 100)}%;"
    ></div>
  </div>
  <span class="text-sm">
    {interval}
    {goalIntervalTimeUnitToString(intervalTimeUnit, interval)}
  </span>
</div>

<style>
  .goal-bar {
    width: var(--percentGoal);
  }
</style>
