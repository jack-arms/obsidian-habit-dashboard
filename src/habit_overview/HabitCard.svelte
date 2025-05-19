<script lang="ts">
  import { ArrowDown, ArrowUp, ChevronRight } from "lucide-svelte";
  import { Button, Card } from "flowbite-svelte";
  import { getHabitGoalProgress } from "../utils/habitDataUtils";
  import HabitTimeSinceBadge from "./HabitTimeSinceBadge.svelte";
  import type { Habit, HabitDayProgress } from "src/types";
  import { moment } from "obsidian";
  import {
    goalIntervalTimeUnitToString,
    latestHabitProgress,
  } from "src/utils/utils";
  import HabitGoalProgressCircle from "./HabitGoalProgressCircle.svelte";
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
  let latestDay = $derived(latestHabitProgress(Object.values(habitProgress)));
  let daysSince = $derived(
    latestDay != null ? moment().diff(moment(latestDay.date), "days") : null,
  );
</script>

<div class="flex flex-row items-center space-x-2">
  <Card
    class="p-4 relative rounded-none! text-(--text-normal) border-(--background-modifier-border) bg-(--background-primary) {isOpen
      ? 'outline-(--interactive-accent-hover) outline-2 z-1 shadow-xl!'
      : 'shadow-none!'}"
    onclick={() => onOpen()}
  >
    <div class="flex flex-row items-center">
      <div class="flex flex-row items-center flex-grow space-x-3 h-14">
        <span class="font-bold">{habit.name}</span>
        <HabitTimeSinceBadge
          variant={habit.goalInfo ? "goal" : "neutral"}
          date={latestDay.date}
          {daysSince}
        />
        {#if habit.goalInfo != null}
          {@const { goalInfo } = habit}
          {@const goalProgress = getHabitGoalProgress(
            habit.goalInfo,
            habitProgress,
          )}
          <div class="flex flex-col flex-grow items-center space-y-1">
            <div class="w-12">
              <HabitGoalProgressCircle
                {goalProgress}
                {...goalInfo}
                stroke={10}
                svgClass={"text-(--background-secondary-alt)"}
              >
                {#snippet progressComponent(habitProgress: number)}
                  {habitProgress}
                {/snippet}
              </HabitGoalProgressCircle>
            </div>
            <span class="flex flex-row text-xs items-center">
              {goalInfo.goal}{goalInfo.goalUnit ?? "X"} / {goalIntervalTimeUnitToString(
                goalInfo.intervalTimeUnit,
                goalInfo.interval,
                true,
              )}
            </span>
          </div>
        {/if}
      </div>
      <ChevronRight class="ml-2" />
    </div>
  </Card>
  <div class="flex flex-col">
    <Button
      disabled={onMoveUp == null}
      class="p-2! h-auto! shadow-none! focus-within:ring-0 bg-transparent! hover:text-(--icon-color-active)! hover:bg-(--background-modifier-hover)!"
      onclick={(e: any) => {
        e.stopPropagation();
        onMoveUp?.();
      }}
    >
      <ArrowUp class="h-5 stroke-current" />
    </Button>
    <Button
      disabled={onMoveDown == null}
      class="p-2! h-auto! shadow-none! focus-within:ring-0 bg-transparent! hover:text-(--icon-color-active)! hover:bg-(--background-modifier-hover)!"
      onclick={(e: any) => {
        e.stopPropagation();
        onMoveDown?.();
      }}
    >
      <ArrowDown class="h-5 stroke-current" />
    </Button>
  </div>
</div>
