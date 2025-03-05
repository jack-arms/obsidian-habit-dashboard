<script lang="ts">
  import type { Habit } from "./main";
  import { Flag, Pencil } from "lucide-svelte";
  import { Button, Card } from "flowbite-svelte";
  import { goalIntervalTimeUnitToString, goalTimeUnitToString } from "./utils";
  interface Props {
    habit: Habit;
    onEdit: () => void;
  }

  let { habit, onEdit }: Props = $props();
</script>

<Card>
  <div class="flex flex-row center-items">
    <h5 class="mb-0! mt-0! text-2xl font-bold text-gray-900 flex-grow">
      {habit.name}
    </h5>
    <div class="flex justify-end">
      <Button
        outline={true}
        class="shadow-none! p-2!"
        on:click={() => onEdit()}
      >
        <Pencil class="w-5 h-5" />
      </Button>
    </div>
  </div>
  <div>Last done on {"{date}"}</div>
  {#if habit.goalInfo != null}
    <span>
      <Flag class="inline mr-2" />{habit.goalInfo.goal}
      {goalTimeUnitToString(habit.goalInfo.goalTimeUnit, habit.goalInfo.goal)}
      every {habit.goalInfo.interval}
      {goalIntervalTimeUnitToString(
        habit.goalInfo.intervalTimeUnit,
        habit.goalInfo.interval,
      )}
    </span>
  {/if}
</Card>
