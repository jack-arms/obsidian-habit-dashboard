<script lang="ts">
  import { Button } from "flowbite-svelte";
  import type { Habit } from "../main";
  import { getHabitDatesToStreakType } from "src/utils";
  import HabitCard from "./HabitCard.svelte";
  import HabitDetails from "./HabitDetails.svelte";

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
  let habitDatesToStreakType = $derived(
    getHabitDatesToStreakType(habitProgressByDate),
  );
  let openHabit = $state<Habit | null>(null);
</script>

<div class="flex flex-row">
  <div class="flex flex-col w-sm border-r border-gray-300 pr-4">
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
    <div class="flex flex-col">
      {#each habits as habit}
        {#key habit.noteKey}
          <HabitCard
            {habit}
            isOpen={habit.noteKey === openHabit?.noteKey}
            habitProgress={habitProgressByDate[habit.noteKey]}
            onMoveDown={() => onMoveHabit(habit, 1)}
            onMoveUp={() => onMoveHabit(habit, -1)}
            onOpen={() => (openHabit = habit)}
          />
        {/key}
      {/each}
    </div>
  </div>
  <div class="flex flex-col px-4">
    {#if openHabit != null}
      <HabitDetails
        habit={openHabit}
        habitProgress={habitProgressByDate[openHabit.noteKey]}
        streakData={habitDatesToStreakType[openHabit.noteKey]}
        onEdit={() => onEdit(openHabit)}
      />
    {/if}
  </div>
</div>
