<script lang="ts">
  import { Flag } from "lucide-svelte";
  import type { GoalIntervalTimeUnit, GoalTimeUnit } from "src/types";
  import HabitGoalProgressBar from "./HabitGoalProgressBar.svelte";

  interface Props {
    goal: number;
    goalTimeUnit: GoalTimeUnit;
    interval: number;
    intervalTimeUnit: GoalIntervalTimeUnit;
    goalProgress: number;
  }

  let { goal, goalTimeUnit, interval, intervalTimeUnit, goalProgress }: Props =
    $props();
</script>

<div class="flex flex-row flex-grow self-stretch items-center py-0.5">
  <Flag class="h-4 w-auto mr-2" />
  <HabitGoalProgressBar
    {goal}
    {goalTimeUnit}
    {interval}
    {intervalTimeUnit}
    {goalProgress}
  />
</div>
