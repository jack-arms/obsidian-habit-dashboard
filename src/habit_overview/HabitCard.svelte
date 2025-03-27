<script lang="ts">
  import type { Habit } from "../main";
  import { ArrowDown, ArrowUp, Hourglass, Pencil } from "lucide-svelte";
  import { Button, Card } from "flowbite-svelte";
  import { daysBetween } from "../utils";
  interface Props {
    habit: Habit;
    habitProgress: Array<{
      date: string;
      value: string;
    }>;
    onEdit: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
  }

  let { habit, habitProgress, onEdit, onMoveDown, onMoveUp }: Props = $props();
  let daysSince = $derived(
    daysBetween(
      new Date(),
      new Date(habitProgress[habitProgress.length - 1].date),
    ),
  );
</script>

<Card class="h-auto! relative rounded-none! shadow-none! bg-transparent!">
  <div class="flex flex-row items-center">
    <div class="flex flex-grow items-center">
      <p class="text-sm font-medium text-gray-900 truncate dark:text-white">
        {habit.name}
      </p>
      <div
        class="inline-flex items-center text-base text-gray-900 dark:text-white"
      >
        <Hourglass class="h-4" />
        {daysSince}
      </div>
    </div>
    <div class="flex items-center space-x-2">
      <Button
        outline
        class="border-none! shadow-none! p-1!"
        on:click={() => onMoveUp()}
      >
        <ArrowUp class="h-4" />
      </Button>
      <Button
        outline
        class="border-none! shadow-none! p-1!"
        on:click={() => onMoveDown()}
      >
        <ArrowDown class="h-4" />
      </Button>
      <Button
        outline
        class="border-none! shadow-none! p-1!"
        on:click={() => onEdit()}
      >
        <Pencil class="h-4" />
      </Button>
    </div>
  </div>
  <div>Card body</div>
</Card>
