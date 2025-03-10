<script lang="ts">
  import type { Habit } from "./main";
  import {
    Flag,
    Pencil,
    History,
    Hourglass,
    ChevronDown,
    ChevronUp,
  } from "lucide-svelte";
  import { Button, Card } from "flowbite-svelte";
  import {
    daysBetween,
    goalIntervalTimeUnitToString,
    goalTimeUnitToString,
  } from "./utils";
  interface Props {
    habit: Habit;
    onEdit: () => void;
    habitProgress: Array<{
      date: string;
      value: string;
    }>;
  }

  let { habit, onEdit, habitProgress }: Props = $props();
  let expanded = $state(false);
  let daysSince = $derived(
    daysBetween(
      new Date(),
      new Date(habitProgress[habitProgress.length - 1].date),
    ),
  );
</script>

<Card class="p-0!">
  <div
    class="flex flex-row items-center p-2 {expanded
      ? 'shadow-md! transition-shadow duration-0 delay-0'
      : 'shdow-none! transition-shadow duration-0 delay-500'}"
  >
    <h5 class="mb-0! mt-0! text-2xl font-bold text-gray-900 flex-grow">
      {habit.name}
    </h5>
    <Hourglass />
    {daysSince}
    {#if expanded}
      <Button
        outline={true}
        class="shadow-none! p-2! focus:ring-0"
        on:click={() => (expanded = false)}
      >
        <ChevronUp />
      </Button>
    {:else}
      <Button
        outline={true}
        class="shadow-none! p-2! focus:ring-0"
        on:click={() => (expanded = true)}
      >
        <ChevronDown />
      </Button>
    {/if}
  </div>
  <div
    class="flex flex-col {!expanded
      ? 'max-h-0'
      : 'max-h-50'} transition-max-height duration-500 ease-in-out overflow-hidden"
  >
    <div class="flex flex-row p-2">
      <div class="flex flex-row items-center grow">
        <History class="mr-2" />
        {#if Object.keys(habitProgress).length === 0}
          Never done!
        {:else}
          Last done on {Object.values(habitProgress)[
            Object.keys(habitProgress).length - 1
          ].date}
        {/if}
      </div>
      <div class="flex justify-end p-2 mr-auto">
        <Button
          outline={true}
          class="shadow-none! p-2!"
          on:click={() => onEdit()}
        >
          <Pencil class="w-5 h-5" />
        </Button>
      </div>
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
  </div>
</Card>
