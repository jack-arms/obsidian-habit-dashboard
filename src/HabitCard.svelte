<script lang="ts">
  import type { Habit } from "./main";
  import { Hourglass } from "lucide-svelte";
  import { ListgroupItem } from "flowbite-svelte";
  import { daysBetween } from "./utils";
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
  on:click={() => onClick()}
>
  <div class="p-2 flex flex-row flex-grow">
    <p
      class="text-sm font-medium text-gray-900 truncate dark:text-white flex-grow"
    >
      {habit.name}
    </p>
    <div
      class="inline-flex items-center text-base text-gray-900 dark:text-white"
    >
      <Hourglass />
      {daysSince}
    </div>
  </div>
</ListgroupItem>
