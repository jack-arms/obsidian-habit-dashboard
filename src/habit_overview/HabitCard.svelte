<script lang="ts">
  import type { Habit } from "../main";
  import { ArrowDown, ArrowUp, ChevronRight } from "lucide-svelte";
  import { Button, Card } from "flowbite-svelte";
  import { daysBetween } from "../utils";
  import HabitHeader from "./HabitHeader.svelte";
  interface Props {
    habit: Habit;
    habitProgress: Array<{
      date: string;
      value: string;
    }>;
    onMoveUp: (() => void) | null;
    onMoveDown: (() => void) | null;
    isOpen: boolean;
    onOpen: () => void;
  }

  let { habit, habitProgress, onMoveDown, onMoveUp, isOpen, onOpen }: Props =
    $props();
  let daysSince = $derived(
    daysBetween(
      new Date(),
      new Date(habitProgress[habitProgress.length - 1].date),
    ),
  );
</script>

<div class="flex flex-row items-center">
  <Card
    class="h-auto! relative rounded-none! shadow-none! {isOpen
      ? 'bg-gray-100!'
      : 'bg-transparent!'}"
    on:click={() => onOpen()}
  >
    <div class="flex flex-row items-center">
      <HabitHeader habitName={habit.name} {daysSince} />
      <ChevronRight />
    </div>
  </Card>
  <div class="flex flex-col">
    <Button
      disabled={onMoveUp == null}
      class="p-2! h-auto! shadow-none! focus-within:ring-0 hover:text-primary-700!"
      on:click={(e) => {
        e.stopPropagation();
        onMoveUp?.();
      }}
    >
      <ArrowUp class="h-5 stroke-current" />
    </Button>
    <Button
      disabled={onMoveDown == null}
      class="p-2! h-auto! shadow-none! focus-within:ring-0 hover:text-primary-700!"
      on:click={(e) => {
        e.stopPropagation();
        onMoveDown?.();
      }}
    >
      <ArrowDown class="h-5 stroke-current" />
    </Button>
  </div>
</div>
