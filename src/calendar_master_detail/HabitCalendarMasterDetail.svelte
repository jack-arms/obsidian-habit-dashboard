<script lang="ts">
  import { Button, Listgroup } from "flowbite-svelte";
  import type { Habit } from "../main";
  import { dateKeyFormat, getHabitDatesToStreakType } from "../utils";
  import HabitListGroupItem from "./HabitListGroupItem.svelte";
  import ScrollableCalendar from "../scrollable_calendar/ScrollableCalendar.svelte";
  import CalendarStreakDay from "../scrollable_calendar/CalendarStreakDay.svelte";
  import { Pencil } from "lucide-svelte";

  interface Props {
    habits: Habit[];
    habitProgressByDate: {
      [noteKey: string]: {
        date: string;
        value: string;
      }[];
    };
    onEdit: (habit: Habit | null) => void;
  }

  let { habits, habitProgressByDate, onEdit }: Props = $props();

  let activeHabit = $state<Habit | null>(null);
  let habitDatesToStreakType = $derived(
    getHabitDatesToStreakType(habitProgressByDate),
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
    <Listgroup
      active
      defaultClass="divide-y! divide-gray-200! dark:divide-gray-600!"
    >
      {#each habits as habit}
        <HabitListGroupItem
          {habit}
          habitProgress={habitProgressByDate[habit.noteKey]}
          onClick={() => (activeHabit = habit)}
          isSelected={habit.noteKey === activeHabit?.noteKey}
        />
      {/each}
    </Listgroup>
  </div>
  <div class="flex flex-col px-4">
    <h2>Calendar</h2>
    {#if activeHabit != null}
      <div class="flex flex-row items-center">
        <h2 class="self-start flex-grow">{activeHabit.name}</h2>
        <div class="flex justify-end">
          <Button
            outline={true}
            class="shadow-none! p-2!"
            on:click={() => onEdit(activeHabit)}
          >
            <Pencil class="w-5 h-5" />
          </Button>
        </div>
      </div>
      {#if Object.keys(habitProgressByDate[activeHabit.noteKey]).length === 0}
        Never done!
      {:else}
        Last done on {Object.values(habitProgressByDate[activeHabit.noteKey])[
          Object.keys(habitProgressByDate[activeHabit.noteKey]).length - 1
        ].date}.
      {/if}
      <h3 class="self-start">Progress</h3>
      <div class="self-center">
        <ScrollableCalendar centerDate={new Date()}>
          {#snippet dayComponent(
            date: Date,
            isLastWeek: boolean,
            isLastDayOfMonth: boolean,
          )}
            {@const streakType =
              activeHabit == null
                ? null
                : habitDatesToStreakType[activeHabit.noteKey][
                    dateKeyFormat(date)
                  ]}
            <CalendarStreakDay
              {date}
              {isLastWeek}
              {isLastDayOfMonth}
              {streakType}
            />
          {/snippet}
        </ScrollableCalendar>
      </div>
    {/if}
  </div>
</div>
