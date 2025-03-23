<script lang="ts">
  import type { Habit } from "../main";
  import { Hourglass } from "lucide-svelte";
  import { ListgroupItem } from "flowbite-svelte";
  import { daysBetween } from "../utils";
  interface Props {
    habit: Habit;
    habitProgress: Array<{
      date: string;
      value: string;
    }>;
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

<ListgroupItem
  class="h-auto! relative rounded-none! shadow-none! bg-transparent! {isSelected
    ? 'bg-gray-100!'
    : ''}"
  hoverClass={!isSelected ? "hover:bg-gray-50!" : ""}
  focusClass=""
  on:click={() => onClick()}
>
  <div class="p-2 flex flex-row flex-grow items-center">
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
</ListgroupItem>
