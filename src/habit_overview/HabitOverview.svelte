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
  }

  let { habits, habitProgressByDate, onEdit }: Props = $props();
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
      <HabitCard {habit} habitProgress={habitProgressByDate[habit.noteKey]} />
    {/each}
  </div>
</div>
