<script lang="ts">
  import { moment } from "obsidian";
  import { Hourglass } from "lucide-svelte";
  import { Card, Checkbox } from "flowbite-svelte";
  import { latestHabitProgress } from "../utils/utils";
  import type { Habit, HabitDayProgress } from "src/types";
  import { getContext } from "svelte";
  interface Props {
    habit: Habit;
    habitProgress: { [date: string]: HabitDayProgress };
    onClick: () => void;
    isSelected: boolean;
  }

  let { habit, habitProgress, onClick, isSelected }: Props = $props();

  const dateFormat = getContext<string>("date-format");
  let daysSince = $derived(
    moment().diff(
      moment(
        latestHabitProgress(Object.values(habitProgress)).date,
        dateFormat,
      ),
      "days",
    ),
  );
</script>

<Card
  class="p-1! rounded-none! shadow-none! bg-transparent! {isSelected
    ? 'bg-gray-100!'
    : ''}"
  onclick={() => onClick()}
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
