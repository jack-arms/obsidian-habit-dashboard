<script lang="ts">
  import type { Habit } from "../main";
  import { Hourglass } from "lucide-svelte";
  import { Card, ListgroupItem } from "flowbite-svelte";
  import { daysBetween } from "../utils";
  interface Props {
    habit: Habit;
    habitProgress: Array<{
      date: string;
      value: string;
    }>;
  }

  let { habit, habitProgress }: Props = $props();
  let daysSince = $derived(
    daysBetween(
      new Date(),
      new Date(habitProgress[habitProgress.length - 1].date),
    ),
  );
</script>

<Card class="h-auto! relative rounded-none! shadow-none! bg-transparent!">
  <div class="flex flex-row flex-grow items-center">
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
  <div>Card body</div>
</Card>
