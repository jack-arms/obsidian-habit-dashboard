<script lang="ts">
  import { Button } from "flowbite-svelte";
  import type { Habit } from "../main";
  import {
    dateKeyFormat,
    getHabitGoalProgress,
    getHabitGoalProgressString,
  } from "src/utils";
  import { Calendar, Flag, Notebook, Pencil } from "lucide-svelte";
  import ScrollableCalendar from "src/scrollable_calendar/ScrollableCalendar.svelte";
  import CalendarStreakDay, {
    type StreakType,
  } from "src/scrollable_calendar/CalendarStreakDay.svelte";
  import HabitGoalProgressBar from "./HabitGoalProgressBar.svelte";

  interface Props {
    habit: Habit;
    habitProgress: Array<{
      date: string;
      value: string;
    }>;
    streakData: { [date: string]: StreakType };
    onEdit: (habit: Habit | null) => void;
  }

  let { habit, habitProgress, streakData, onEdit }: Props = $props();

  const fourWeeksAgo = (() => {
    let date = new Date();
    date.setDate(date.getDate() - (7 * 4 - 1));
    return date;
  })();

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
      <div class="flex w-100 h-15">
        <HabitGoalProgressBar {...goalInfo} {goalProgress} />
      </div>
    </div>
  {/if}
  <div class="flex flex-col">
    <div class="flex flex-row items-center space-x-2">
      <Notebook />
      <h3 class="m-0!">Progress</h3>
    </div>
    <div>
      <p>Last done on X</p>
      <p>Twice in last 30 days</p>
    </div>
  </div>
  <div class="flex flex-col space-y-3">
    <div class="flex flex-row items-center">
      <div class="flex flex-row items-center space-x-2">
        <Calendar />
        <h3 class="m-0!">Calendar</h3>
      </div>
    </div>
    <ScrollableCalendar endDate={new Date()} numWeeks={12} bind:calendarElement>
      {#snippet dayComponent(
        date: Date,
        isLastWeek: boolean,
        isLastDayOfMonth: boolean,
      )}
        {@const streakType = streakData[dateKeyFormat(date)]}
        <CalendarStreakDay
          {date}
          {isLastWeek}
          {isLastDayOfMonth}
          {streakType}
        />
      {/snippet}
    </ScrollableCalendar>
  </div>
</div>
