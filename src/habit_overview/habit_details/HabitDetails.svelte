<script lang="ts">
  import { getHabitGoalProgress } from "src/utils/habitDataUtils";
  import { getDateKey, goalIntervalTimeUnitToString } from "src/utils/utils";
  import { Calendar, Flag, Notebook } from "lucide-svelte";
  import ScrollableCalendar from "src/scrollable_calendar/ScrollableCalendar.svelte";
  import CalendarDayWithNoteData, {
    type StreakType,
  } from "src/scrollable_calendar/CalendarDayWithNoteData.svelte";
  import type { Habit, HabitDayProgress } from "src/types";
  import { moment } from "obsidian";
  import HabitGoalProgressCircle from "../HabitGoalProgressCircle.svelte";
  import HabitDetailsProgress from "./HabitDetailsProgress.svelte";
  import HabitDetailsHeader from "./HabitDetailsHeader.svelte";
  import { Card } from "flowbite-svelte";

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

<div class="flex flex-col space-y-6">
  <HabitDetailsHeader {habit} {habitProgress} {onEdit} />
  <div class="flex flex-col space-y-6">
    <div class="flex flex-row space-x-6">
      {#if habit.goalInfo != null}
        {@const { goalInfo } = habit}
        {@const goalProgress = getHabitGoalProgress(goalInfo, habitProgress)}
        <Card
          class="flex flex-col p-4 w-auto space-y-4 bg-(--background-primary) text-(--text-normal) border-2 border-(--background-modifier-border)"
        >
          <div class="flex flex-row items-center space-x-2">
            <Flag />
            <h3 class="m-0!">Goal</h3>
          </div>
          <div class="flex flex-col items-center space-y-2 px-2 w-fit">
            <div class="w-30 h-30">
              <HabitGoalProgressCircle
                stroke={8}
                {...goalInfo}
                {goalProgress}
                svgClass="text-(--background-secondary)"
              >
                {#snippet progressComponent(habitProgress: number)}
                  <span class="text-xl {habitProgress > 0 ? 'font-bold' : ''}">
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
        </Card>
      {/if}
      <Card
        class="flex flex-col p-4 w-auto space-y-4 min-w-xs bg-(--background-primary) text-(--text-normal) border-2 border-(--background-modifier-border)"
      >
        <div class="flex flex-row items-center space-x-2">
          <Notebook />
          <h3 class="m-0!">Progress</h3>
        </div>
        <HabitDetailsProgress {habitProgress} />
      </Card>
    </div>
    <Card
      class="flex flex-col p-4 space-y-4 w-auto! max-w-full bg-(--background-primary) text-(--text-normal) border-2 border-(--background-modifier-border)"
    >
      <div class="flex flex-row items-center space-y-4">
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
    </Card>
  </div>
</div>
