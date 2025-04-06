<script lang="ts">
  import type { Habit } from "../main";
  import { ArrowDown, ArrowUp, ChevronRight } from "lucide-svelte";
  import { Button, Card } from "flowbite-svelte";
  import { daysBetween, getHabitGoalProgress } from "../utils";
  import HabitGoalBadge from "./HabitGoalBadge.svelte";
  import HabitTimeSinceBadge from "./HabitTimeSinceBadge.svelte";
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
    class="h-auto! relative rounded-none! shadow-none! text-base text-gray-900 dark:text-white{isOpen
      ? 'bg-gray-100!'
      : 'bg-transparent!'}"
    on:click={() => onOpen()}
  >
    <div class="flex flex-row items-center">
      <div class="flex flex-row items-center flex-grow space-x-2">
        <span class="font-bold">{habit.name}</span>
        <HabitTimeSinceBadge {daysSince} />
        {#if habit.goalInfo != null}
          {@const { goalInfo } = habit}
          {@const goalProgress = getHabitGoalProgress(goalInfo, habitProgress)}
          <HabitGoalBadge {goalProgress} {...goalInfo} />
        {/if}
      </div>
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
