<script lang="ts">
  import type { Habit } from "./main";
  import { Flag, Pencil, History, Hourglass } from "lucide-svelte";
  import {
    Accordion,
    AccordionItem,
    Button,
    ListgroupItem,
  } from "flowbite-svelte";
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
    onClick: () => void;
  }

  let { habit, onEdit, habitProgress, onClick }: Props = $props();
  let daysSince = $derived(
    daysBetween(
      new Date(),
      new Date(habitProgress[habitProgress.length - 1].date),
    ),
  );
</script>

<ListgroupItem
  class="flex box-border! h-auto! rounded-md!"
  on:click={() => {
    console.log("A");
    onClick();
  }}
>
  <div class="p-2 flex flex-row flex-grow">
    <p
      class="text-sm font-medium text-gray-900 truncate dark:text-white flex-grow"
    >
      {habit.name}
    </p>
    <!-- <p class="text-sm text-gray-500 truncate dark:text-gray-400">
      {item.email}
    </p> -->
    <div
      class="inline-flex items-center text-base text-gray-900 dark:text-white"
    >
      <Hourglass />
      {daysSince}
    </div>
  </div>
</ListgroupItem>

<!-- <Accordion
  class="accordion border border-gray-200 dark:border-gray-700 rounded-md"
  flush
>
  <AccordionItem
    class="p-4! h-auto! border-b! border-gray-200! dark:border-gray-700! bg-gray-50! hover:bg-gray-100! box-border!"
    tag="div"
  >
    <div slot="header" class="flex flex-row flex-grow items-center pr-2">
      <h5 class="mb-0! mt-0! text-2xl font-bold text-gray-900 flex-grow">
        {habit.name}
      </h5>
    </div>
    <div>
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
          {goalTimeUnitToString(
            habit.goalInfo.goalTimeUnit,
            habit.goalInfo.goal,
          )}
          every {habit.goalInfo.interval}
          {goalIntervalTimeUnitToString(
            habit.goalInfo.intervalTimeUnit,
            habit.goalInfo.interval,
          )}
        </span>
      {/if}
    </div>
  </AccordionItem>
</Accordion> -->
