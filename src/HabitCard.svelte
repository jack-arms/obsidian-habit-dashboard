<script lang="ts">
  import type { Habit } from "./main";
  import { Flag, Pencil, History } from "lucide-svelte";
  import { Button, Card } from "flowbite-svelte";
  import { goalIntervalTimeUnitToString, goalTimeUnitToString } from "./utils";
  interface Props {
    habit: Habit;
    onEdit: () => void;
    habitProgress: Array<{
      date: string;
      value: string;
    }>;
  }

  let { habit, onEdit, habitProgress }: Props = $props();
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
  <div class="flex flex-row items-center">
    <History class="mr-2" />
    {#if Object.keys(habitProgress).length === 0}
      Never done!
    {:else}
      Last done on {Object.values(habitProgress)[
        Object.keys(habitProgress).length - 1
      ].date}
    {/if}
  </div>
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
