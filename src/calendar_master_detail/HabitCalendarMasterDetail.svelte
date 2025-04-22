<script lang="ts">
  import { Button } from "flowbite-svelte";
  import { getHabitProgressWithStreakType, localDateKeyFormat } from "../utils";
  import HabitListItem from "./HabitListItem.svelte";
  import ScrollableCalendar from "../scrollable_calendar/ScrollableCalendar.svelte";
  import CalendarStreakDay from "../scrollable_calendar/CalendarDayWithNoteData.svelte";
  import type { Habit, HabitDayProgress } from "src/types";
  import CalendarDayWithNoteData from "../scrollable_calendar/CalendarDayWithNoteData.svelte";

  interface Props {
    habits: Habit[];
    habitProgressByDate: {
      [noteKey: string]: { [date: string]: HabitDayProgress };
    };
    onEdit: (habit: Habit | null) => void;
  }

  let { habits, habitProgressByDate, onEdit }: Props = $props();

  let activeHabit = $state<Habit | null>(null);
  let activeHabitKey = $derived(activeHabit?.noteKey);
  let habitProgressWithStreakType = $derived(
    getHabitProgressWithStreakType(habitProgressByDate),
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
        on:click={() => onEdit(null)}
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
      <ScrollableCalendar endDate={new Date()} numWeeks={12}>
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
            habitProgress={activeHabit != null
              ? habitProgressWithStreakType[activeHabit.noteKey][dateKey]
              : null}
          />
        {/snippet}
      </ScrollableCalendar>
    </div>
  </div>
</div>
