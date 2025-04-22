<script lang="ts">
  import { Accordion, Button } from "flowbite-svelte";
  import { getHabitProgressWithStreakType } from "src/utils";
  import HabitAccordionItem from "./HabitAccordionItem.svelte";
  import type { Habit, HabitDayProgress } from "src/types";

  interface Props {
    habits: Habit[];
    habitProgressByDate: {
      [noteKey: string]: {
        [date: string]: HabitDayProgress;
      };
    };
    onEdit: (habit: Habit | null) => void;
    onMoveHabit: (habit: Habit, change: 1 | -1) => void;
  }

  let { habits, habitProgressByDate, onEdit, onMoveHabit }: Props = $props();
  let habitProgressWithStreakType = $derived(
    getHabitProgressWithStreakType(habitProgressByDate),
  );
  let openHabit = $state<string | null>(null);
</script>

<div class="flex flex-col">
  <div class="flex flex-row items-center">
    <h3 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
      Habits
    </h3>
    <Button
      class="ml-4 text-sm! font-medium text-primary-600! dark:text-primary-500"
      on:click={() => onEdit(null)}
    >
      Add new
    </Button>
  </div>
  <Accordion class="w-lg">
    {#each habits as habit}
      {#key habit.noteKey}
        <HabitAccordionItem
          {habit}
          habitProgress={habitProgressWithStreakType[habit.noteKey]}
          onEdit={() => onEdit(habit)}
          onMoveDown={() => onMoveHabit(habit, 1)}
          onMoveUp={() => onMoveHabit(habit, -1)}
          open={habit.noteKey === openHabit}
          setIsOpen={(isOpen: boolean) => {
            if (isOpen) {
              openHabit = habit.noteKey;
            } else if (openHabit === habit.noteKey) {
              openHabit = null;
            }
          }}
        />
      {/key}
    {/each}
  </Accordion>
</div>
