<script lang="ts">
  import { Flag } from "lucide-svelte";
  import type { GoalIntervalTimeUnit } from "src/types";
  import HabitGoalProgressBar from "./HabitGoalProgressBar.svelte";
  import type { HabitProgressUnit } from "src/units";

  interface Props {
    goal: number;
    goalUnit: HabitProgressUnit | string | null;
    interval: number;
    intervalTimeUnit: GoalIntervalTimeUnit;
    goalProgress: number;
  }

  let { goal, goalUnit, interval, intervalTimeUnit, goalProgress }: Props =
    $props();
</script>

<div class="flex flex-row flex-grow self-stretch items-center py-0.5">
  <Flag class="h-4 w-auto mr-2" />
  <HabitGoalProgressBar
    {goal}
    {goalUnit}
    {interval}
    {intervalTimeUnit}
    {goalProgress}
  />
</div>
