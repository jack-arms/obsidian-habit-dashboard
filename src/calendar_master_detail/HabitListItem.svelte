<script lang="ts">
  import type { Habit } from "../main";
  import { Hourglass } from "lucide-svelte";
  import { Card, Checkbox } from "flowbite-svelte";
  import { daysBetween } from "../utils";
  import type { HabitDayProgress } from "src/types";
  interface Props {
    habit: Habit;
    habitProgress: HabitDayProgress[];
    onClick: () => void;
    isSelected: boolean;
  }

  let { habit, habitProgress, onClick, isSelected }: Props = $props();
  let daysSince = $derived(
    daysBetween(
      new Date(),
      new Date(habitProgress[habitProgress.length - 1].date),
    ),
  );
</script>

<Card
  class="p-1! rounded-none! shadow-none! bg-transparent! {isSelected
    ? 'bg-gray-100!'
    : ''}"
  on:click={() => onClick()}
>
  <div class="p-2 flex flex-row flex-grow items-center space-x-2">
    <Checkbox checked={isSelected} />
    <p
      class="text-sm font-medium text-gray-900 truncate dark:text-white flex-grow"
    >
      {habit.name}
    </p>
    <div
      class="inline-flex items-center text-base text-gray-900 dark:text-white"
    >
      <Hourglass class="h-4" />
      {daysSince}
    </div>
  </div>
</Card>
