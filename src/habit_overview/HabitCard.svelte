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
    roundForDisplay,
  } from "src/utils/utils";
  import HabitGoalProgressCircle from "./HabitGoalProgressCircle.svelte";
  import { getContext } from "svelte";

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
  const dateFormat = getContext<string>("date-format");
  let latestDay = $derived(latestHabitProgress(Object.values(habitProgress)));
  let daysSince = $derived(
    latestDay != null
      ? moment().diff(moment(latestDay.date, dateFormat), "days")
      : null,
  );
</script>

<div class="flex flex-row items-center space-x-2">
  <Card
    class="p-4 relative rounded-none! text-(--text-normal) border-2 [&:not(:last-child)]:-mt-px border-(--background-modifier-border) bg-(--background-primary) {isOpen
      ? 'outline-(--interactive-accent-hover) outline-2 z-1 shadow-xl! border-transparent'
      : 'shadow-none!'}"
    onclick={() => onOpen()}
  >
    <div class="flex flex-row items-center">
      <div class="flex flex-row items-center flex-grow space-x-4 h-auto">
        <span class="font-bold">{habit.name}</span>
        <HabitTimeSinceBadge
          variant={habit.goalInfo ? "goal" : "neutral"}
          date={latestDay.date}
          {daysSince}
          compact
        />
        {#if habit.goalInfo != null}
          {@const { goalInfo } = habit}
          {@const goalProgress = getHabitGoalProgress(
            habit.goalInfo,
            habitProgress,
            dateFormat,
          )}
          <div class="flex flex-col items-center space-y-1 min-w-[75px]">
            <div class="w-12">
              <HabitGoalProgressCircle
                {goalProgress}
                {...goalInfo}
                stroke={10}
              >
                {#snippet progressComponent(habitProgress: number)}
                  <span class={habitProgress > 0 ? "font-bold" : ""}
                    >{roundForDisplay(habitProgress)}</span
                  >
                {/snippet}
              </HabitGoalProgressCircle>
            </div>
            <span class="flex flex-row text-xs text-center items-center">
              {goalInfo.goal}{goalInfo.goalUnit ?? "X"} / {goalIntervalTimeUnitToString(
                goalInfo.intervalTimeUnit,
                goalInfo.interval,
                true,
              )}
            </span>
          </div>
        {/if}
      </div>
      <ChevronRight class="ml-2 shrink-0" />
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
