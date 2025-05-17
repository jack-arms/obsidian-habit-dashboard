<script lang="ts">
  import { Button } from "flowbite-svelte";
  import HabitCard from "./HabitCard.svelte";
  import HabitDetails from "./habit_details/HabitDetails.svelte";
  import type { Habit, HabitDayProgress } from "src/types";
  import { getStreakDataByHabit } from "src/utils/habitDataUtils";
  import { Plus } from "lucide-svelte";

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
  let streakData = $derived(getStreakDataByHabit(habitProgressByDate));
  let openHabitKey = $state<string | null>(null);
  let openHabit = $derived(habits.find((h) => h.noteKey === openHabitKey));
</script>

<div class="flex flex-row">
  <div class="flex flex-col w-sm border-r border-gray-300 pr-4">
    <div class="flex flex-row items-center space-x-4">
      <h3 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
        Habits
      </h3>
      <Button
        class="h-9! p-2! text-sm! font-medium text-primary-600! dark:text-primary-500 flex flex-row items-center space-x-1"
        on:click={() => onEdit(null)}
      >
        <Plus />
        <span>Add</span>
      </Button>
    </div>
    <div class="flex flex-col">
      {#each habits as habit, index}
        {#key habit.noteKey}
          <HabitCard
            {habit}
            isOpen={habit.noteKey === openHabit?.noteKey}
            habitProgress={habitProgressByDate[habit.noteKey]}
            onMoveDown={index === habits.length - 1
              ? null
              : () => onMoveHabit(habit, 1)}
            onMoveUp={index === 0 ? null : () => onMoveHabit(habit, -1)}
            onOpen={() => (openHabitKey = habit.noteKey)}
          />
        {/key}
      {/each}
    </div>
  </div>
  <div class="px-4">
    {#if openHabit != null}
      <HabitDetails
        habit={openHabit}
        habitProgress={habitProgressByDate[openHabit.noteKey]}
        streakData={streakData[openHabit.noteKey]}
        onEdit={() => onEdit(openHabit)}
      />
    {/if}
  </div>
</div>
