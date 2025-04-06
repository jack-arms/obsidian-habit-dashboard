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

<div class="flex flex-row items-center">
  <Flag class="h-4" />
  <span>
    {goalProgress} / {goal}{goalTimeUnit}
  </span>
  <span class="ml-2 px-1 py-px border rounded-sm text-sm">
    {interval}{intervalTimeUnit}
  </span>
</div>
