<script lang="ts">
  import { Button } from "flowbite-svelte";
  import {
    getHabitGoalProgress,
    getAggregatedHabitProgress,
  } from "src/utils/habitDataUtils";
  import {
    formatMinutes,
    getDateKey,
    goalIntervalTimeUnitToString,
    latestHabitProgress,
  } from "src/utils/utils";
  import { Calendar, Flag, Notebook, Pencil } from "lucide-svelte";
  import ScrollableCalendar from "src/scrollable_calendar/ScrollableCalendar.svelte";
  import CalendarDayWithNoteData, {
    type StreakType,
  } from "src/scrollable_calendar/CalendarDayWithNoteData.svelte";
  import type { Habit, HabitDayProgress } from "src/types";
  import { moment } from "obsidian";
  import HabitGoalProgressCircle from "./HabitGoalProgressCircle.svelte";

  interface Props {
    habit: Habit;
    habitProgress: {
      [date: string]: HabitDayProgress;
    };
    streakData: {
      [date: string]: StreakType;
    };
    onEdit: (habit: Habit | null) => void;
  }

  let { habit, habitProgress, streakData, onEdit }: Props = $props();
  let habitProgressLastMonth = $derived(
    getAggregatedHabitProgress(habitProgress, moment().subtract(1, "month")),
  );
  let latestProgress = $derived(
    latestHabitProgress(Object.values(habitProgress)),
  );

  let calendarElement = $state<HTMLElement | undefined>(undefined);
  $effect(() => {
    if (calendarElement != null) {
      calendarElement.scroll({
        top: calendarElement.scrollHeight,
        behavior: "instant",
      });
    }
  });
</script>

<div class="flex flex-row space-x-2 items-center">
  <h2>{habit.name}</h2>
  <Button
    outline
    class="shadow-none! p-2! h-auto!"
    on:click={() => onEdit(null)}
  >
    <Pencil />
  </Button>
</div>
<div class="flex flex-col space-y-2">
  {#if habit.goalInfo != null}
    {@const { goalInfo } = habit}
    {@const goalProgress = getHabitGoalProgress(goalInfo, habitProgress)}
    <div class="flex flex-col">
      <div class="flex flex-row items-center space-x-2">
        <Flag />
        <h3 class="m-0!">Goal</h3>
      </div>
      <div class="flex flex-col items-center space-y-2 p-2 w-fit">
        <div class="w-30 h-30">
          <HabitGoalProgressCircle stroke={8} {...goalInfo} {goalProgress}>
            {#snippet progressComponent(habitProgress: number)}
              <span class="text-xl">
                {habitProgress}
              </span>
            {/snippet}
          </HabitGoalProgressCircle>
        </div>
        <span class="flex flex-row text-lg items-center">
          {goalInfo.goal}{goalInfo.goalUnit ?? "X"} /
          {goalIntervalTimeUnitToString(
            goalInfo.intervalTimeUnit,
            goalInfo.interval,
            true,
          )}
        </span>
      </div>
    </div>
  {/if}
  <div class="flex flex-col">
    <div class="flex flex-row items-center space-x-2">
      <Notebook />
      <h3 class="m-0!">Progress</h3>
    </div>
    <ul>
      <li>
        {#if latestProgress != null}
          Last done on {moment(latestProgress.date).format(
            "dddd, MMMM D, YYYY",
          )}
        {:else}
          Not yet done
        {/if}
      </li>
      <li>
        In the last 30 days:
        <ul>
          {#if habitProgressLastMonth.times > 0}
            <li>{habitProgressLastMonth.times} times</li>
            {#if habitProgressLastMonth.minutes > 0}
              <li>{formatMinutes(habitProgressLastMonth.minutes)}</li>
            {/if}
            {#each Object.entries(habitProgressLastMonth.progress) as [unit, value]}
              <li>{value} {unit}</li>
            {/each}
          {:else}
            <li>No progress</li>
          {/if}
        </ul>
      </li>
    </ul>
  </div>
  <div class="flex flex-col space-y-3">
    <div class="flex flex-row items-center">
      <div class="flex flex-row items-center space-x-2">
        <Calendar />
        <h3 class="m-0!">Calendar</h3>
      </div>
    </div>
    <ScrollableCalendar endDate={moment()} numWeeks={12} bind:calendarElement>
      {#snippet dayComponent(
        date: moment.Moment,
        isLastWeek: boolean,
        isLastDayOfMonth: boolean,
      )}
        {@const dateKey = getDateKey(date)}
        <CalendarDayWithNoteData
          {date}
          {isLastWeek}
          {isLastDayOfMonth}
          habitProgress={habitProgress[dateKey]}
          streakType={streakData[dateKey]}
        />
      {/snippet}
    </ScrollableCalendar>
  </div>
</div>

<style>
  ul {
    list-style: none;
  }

  li::before {
    content: "\2014" !important;
    padding-right: calc(var(--spacing) * 2);
  }

  li {
    padding-left: calc(var(--spacing) * 2);
  }
</style>
