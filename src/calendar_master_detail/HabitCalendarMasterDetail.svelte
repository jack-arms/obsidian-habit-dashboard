<script lang="ts">
  import { Button } from "flowbite-svelte";
  import { getDateKey } from "../utils/utils";
  import { getStreakDataByHabit } from "../utils/habitDataUtils";
  import HabitListItem from "./HabitListItem.svelte";
  import ScrollableCalendar from "../scrollable_calendar/ScrollableCalendar.svelte";
  import type { Habit, HabitDayProgress } from "src/types";
  import CalendarDayWithNoteData from "../scrollable_calendar/CalendarDayWithNoteData.svelte";
  import { moment } from "obsidian";
  import { getContext } from "svelte";

  interface Props {
    habits: Habit[];
    habitProgressByDate: {
      [noteKey: string]: { [date: string]: HabitDayProgress };
    };
    onEdit: (habit: Habit | null) => void;
  }

  let { habits, habitProgressByDate, onEdit }: Props = $props();
  const dateFormat = getContext<string>("date-format");

  let activeHabit = $state<Habit | null>(null);
  let activeHabitKey = $derived(activeHabit?.noteKey);
  let streakDataByHabit = $derived(
    getStreakDataByHabit(habitProgressByDate, dateFormat),
  );
</script>

<div class="flex flex-row flex-grow">
  <div class="flex flex-col min-w-sm w-sm border-r border-gray-300 pr-4">
    <div class="flex flex-row items-center">
      <h3 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
        Habits
      </h3>
      <Button
        class="ml-4 text-sm! font-medium text-primary-600! dark:text-primary-500"
        onclick={() => onEdit(null)}
      >
        Add new
      </Button>
    </div>
    <div class="space-y-4">
      {#each habits as habit}
        <HabitListItem
          {habit}
          habitProgress={habitProgressByDate[habit.noteKey]}
          onClick={() => (activeHabit = habit)}
          isSelected={habit.noteKey === activeHabitKey}
        />
      {/each}
    </div>
  </div>
  <div class="flex flex-col px-4">
    <h2>Calendar</h2>
    <div class="self-center">
      <ScrollableCalendar endDate={moment()} numWeeks={12}>
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
            habitProgress={activeHabit != null
              ? habitProgressByDate[activeHabit.noteKey][dateKey]
              : null}
            streakType={activeHabit != null
              ? streakDataByHabit[activeHabit.noteKey][dateKey]
              : null}
          />
        {/snippet}
      </ScrollableCalendar>
    </div>
  </div>
</div>
