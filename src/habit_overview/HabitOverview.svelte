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
    openHabitKey: string | null;
  }

  let {
    habits,
    habitProgressByDate,
    onEdit,
    onMoveHabit,
    openHabitKey = $bindable(),
  }: Props = $props();
  let streakData = $derived(getStreakDataByHabit(habitProgressByDate));
  let openHabit = $derived(habits.find((h) => h.noteKey === openHabitKey));
</script>

<div class="flex flex-row h-full">
  <div class="flex flex-col min-w-md w-md pl-4 space-y-4 p-8">
    <div class="flex flex-row items-center space-x-4">
      <h2
        class="my-0! text-xl font-bold leading-none text-gray-900 dark:text-white"
      >
        Habits
      </h2>
      <Button
        class="h-9! p-2! text-sm! font-medium text-white! bg-(--color-accent)! hover:bg-(--interactive-accent-hover)! flex flex-row items-center space-x-1"
        onclick={() => {
          onEdit(null);
        }}
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
  <div
    class="border-r border-2 border-(--background-modifier-border) h-full"
  ></div>
  {#if openHabit != null}
    <div class="p-8">
      <HabitDetails
        habit={openHabit}
        habitProgress={habitProgressByDate[openHabit.noteKey]}
        streakData={streakData[openHabit.noteKey]}
        onEdit={() => onEdit(openHabit)}
      />
    </div>
  {/if}
</div>
