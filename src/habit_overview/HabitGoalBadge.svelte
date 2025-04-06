<script lang="ts">
  import { Flag } from "lucide-svelte";
  import type { GoalIntervalTimeUnit, GoalTimeUnit } from "src/types";

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

<div class="flex flex-row items-center py-0.5 px-2 border rounded-lg">
  <Flag class="h-4 w-auto" />
  <span class="text-lg font-bold px-1">&middot;</span>
  <span>
    {goalProgress} / {goal}{goalTimeUnit}
  </span>
  <span class="ml-1 px-1 py-px text-sm font-semibold">
    {interval}{intervalTimeUnit}
  </span>
</div>
