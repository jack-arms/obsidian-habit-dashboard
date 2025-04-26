<script lang="ts">
  import { Button } from "flowbite-svelte";
  import {
    localDateKeyFormat,
    getHabitGoalProgress,
    getLocalDate,
    latestHabitProgress,
    getAggregatedHabitProgress,
  } from "src/utils";
  import { Calendar, Flag, Notebook, Pencil } from "lucide-svelte";
  import ScrollableCalendar from "src/scrollable_calendar/ScrollableCalendar.svelte";
  import CalendarDayWithNoteData, {
    type StreakType,
  } from "src/scrollable_calendar/CalendarDayWithNoteData.svelte";
  import HabitGoalProgressBar from "./HabitGoalProgressBar.svelte";
  import type { Habit, HabitDayProgress } from "src/types";

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
  let lastMonth = new Date();
  lastMonth.setDate(lastMonth.getDate() - 30);
  let habitProgressLastMonth = $derived(
    getAggregatedHabitProgress(habitProgress, lastMonth),
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
      <div class="flex w-60 h-15">
        <HabitGoalProgressBar {...goalInfo} {goalProgress} />
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
        Last done on {new Date(
          latestHabitProgress(Object.values(habitProgress)).date,
        ).toLocaleDateString()}
      </li>
      {#if habitProgressLastMonth.times > 0}
        <li>{habitProgressLastMonth.times} times in last 30 days</li>
      {:else}
        <li>Not done in the last 30 days.</li>
      {/if}
    </ul>
  </div>
  <div class="flex flex-col space-y-3">
    <div class="flex flex-row items-center">
      <div class="flex flex-row items-center space-x-2">
        <Calendar />
        <h3 class="m-0!">Calendar</h3>
      </div>
    </div>
    <ScrollableCalendar
      endDate={getLocalDate(new Date())}
      numWeeks={12}
      bind:calendarElement
    >
      {#snippet dayComponent(
        date: Date,
        isLastWeek: boolean,
        isLastDayOfMonth: boolean,
      )}
        {@const dateKey = localDateKeyFormat(date)}
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
  li::before {
    content: "\2014" !important;
    padding-right: calc(var(--spacing) * 2);
  }

  li {
    padding-left: calc(var(--spacing) * 2);
  }
</style>
