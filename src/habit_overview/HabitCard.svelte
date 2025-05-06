<script lang="ts">
  import { ArrowDown, ArrowUp, ChevronRight } from "lucide-svelte";
  import { Button, Card } from "flowbite-svelte";
  import { getHabitGoalProgress } from "../utils/habitDataUtils";
  import HabitGoalBadge from "./HabitGoalBadge.svelte";
  import HabitTimeSinceBadge from "./HabitTimeSinceBadge.svelte";
  import type { Habit, HabitDayProgress } from "src/types";
  import { moment } from "obsidian";
  import { latestHabitProgress } from "src/utils/utils";
  import HabitGoalIndicator from "./HabitGoalIndicator.svelte";
  interface Props {
    habit: Habit;
    habitProgress: { [date: string]: HabitDayProgress };
    onMoveUp: (() => void) | null;
    onMoveDown: (() => void) | null;
    isOpen: boolean;
    onOpen: () => void;
  }

  let { habit, habitProgress, onMoveDown, onMoveUp, isOpen, onOpen }: Props =
    $props();
  let daysSince = $derived(
    moment().diff(
      moment(latestHabitProgress(Object.values(habitProgress)).date),
      "days",
    ),
  );

  let { goalInfo } = habit;
  let goalProgress =
    goalInfo != null ? getHabitGoalProgress(goalInfo, habitProgress) : null;
</script>

<div class="flex flex-row items-center">
  <Card
    class="h-auto! relative rounded-none! shadow-none! text-base text-gray-900 dark:text-white{isOpen
      ? 'bg-gray-100!'
      : 'bg-transparent!'}"
    on:click={() => onOpen()}
  >
    <div class="flex flex-row items-center">
      <div class="flex flex-row items-center flex-grow space-x-3 h-14">
        {#if goalProgress != null && goalInfo != null}
          <HabitGoalIndicator {goalProgress} goal={goalInfo.goal} />
        {/if}
        <span class="font-bold">{habit.name}</span>
        <HabitTimeSinceBadge {daysSince} />
        {#if goalProgress != null && goalInfo != null}
          <HabitGoalBadge {goalProgress} {...goalInfo} />
        {/if}
      </div>
      <ChevronRight class="ml-2" />
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
