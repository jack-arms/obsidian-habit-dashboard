<script lang="ts">
  import type { GoalIntervalTimeUnit, HabitTimeUnit } from "src/types";
  import { goalIntervalTimeUnitToString } from "src/utils";

  interface Props {
    goal: number;
    goalTimeUnit: HabitTimeUnit;
    interval: number;
    intervalTimeUnit: GoalIntervalTimeUnit;
    goalProgress: number;
  }

  let { goal, goalTimeUnit, interval, intervalTimeUnit, goalProgress }: Props =
    $props();
</script>

<div class="flex flex-col flex-grow items-center self-stretch">
  <span class="text-sm font-semibold">
    {goalProgress} / {goal}{goalTimeUnit ?? "X"}
  </span>
  <div class="border rounded-sm overflow-hidden flex-grow self-stretch">
    <div
      class="goal-bar bg-gray-200 w-full h-full"
      style="--percentGoal:{Math.min((goalProgress * 100.0) / goal, 100)}%;"
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
