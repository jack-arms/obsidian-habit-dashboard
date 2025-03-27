<script lang="ts">
  import { Button } from "flowbite-svelte";
  import type { Habit } from "../main";
  import HabitCard from "./HabitCard.svelte";

  interface Props {
    habits: Habit[];
    habitProgressByDate: {
      [noteKey: string]: {
        date: string;
        value: string;
      }[];
    };
    onEdit: (habit: Habit | null) => void;
    onMoveHabit: (habit: Habit, change: 1 | -1) => void;
  }

  let { habits, habitProgressByDate, onEdit, onMoveHabit }: Props = $props();
</script>

<div class="flex flex-col flex-grow">
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
  <div class="space-y-4">
    {#each habits as habit}
      {#key habit.noteKey}
        <HabitCard
          {habit}
          habitProgress={habitProgressByDate[habit.noteKey]}
          onEdit={() => onEdit(habit)}
          onMoveDown={() => onMoveHabit(habit, 1)}
          onMoveUp={() => onMoveHabit(habit, -1)}
        />
      {/key}
    {/each}
  </div>
</div>
