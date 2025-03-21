<script lang="ts">
  import { App } from "obsidian";
  import type { Habit, ObsidianHabitDashboardPluginSettings } from "./main";
  import { Button, Listgroup } from "flowbite-svelte";
  import HabitEditModal from "./HabitEditModal.svelte";
  import HabitCard from "./HabitCard.svelte";
  import {
    dateKeyFormat,
    getHabitDatesToStreakType,
    getHabitProgressByDate,
  } from "./utils";
  import ScrollableCalendar from "./scrollable_calendar/ScrollableCalendar.svelte";
  import { Pencil } from "lucide-svelte";
  import CalendarStreakDay from "./scrollable_calendar/CalendarStreakDay.svelte";
  interface Props {
    app: App;
    settings: ObsidianHabitDashboardPluginSettings;
    saveSettings: (settings: ObsidianHabitDashboardPluginSettings) => void;
  }

  let { app, settings, saveSettings }: Props = $props();

  let habits = $state<Habit[]>(settings.habits);
  let activeHabit = $state<Habit | null>(null);

  let modalState = $state<
    { isOpen: true; currentHabit: Habit | null } | { isOpen: false }
  >({
    isOpen: false,
  });

  let habitProgressByDate = $derived(
    getHabitProgressByDate(
      app,
      habits.map((h) => h.noteKey),
    ),
  );

  let habitDatesToStreakType = $derived(
    getHabitDatesToStreakType(habitProgressByDate),
  );
</script>

<div class="flex flex-col h-full p-1">
  <h1 class="font-bold text-center">Obsidian Habit Dashboard</h1>
  <div class="flex flex-row flex-grow">
    <div class="flex flex-col min-w-sm w-sm border-r border-gray-300 pr-4">
      <div class="flex flex-row justify-between items-center">
        <h3
          class="text-xl font-bold leading-none text-gray-900 dark:text-white"
        >
          Habits
        </h3>
        <Button
          class="text-sm! font-medium text-primary-600! dark:text-primary-500"
          on:click={() => {
            modalState = {
              isOpen: true,
              currentHabit: null,
            };
          }}
        >
          Add new
        </Button>
      </div>
      <Listgroup active>
        {#each habits as habit}
          <HabitCard
            {habit}
            onEdit={() =>
              (modalState = {
                isOpen: true,
                currentHabit: habit,
              })}
            habitProgress={habitProgressByDate[habit.noteKey]}
            onClick={() => (activeHabit = habit)}
          />
        {/each}
      </Listgroup>
      {#if modalState.isOpen}
        <HabitEditModal
          onClose={() =>
            (modalState = {
              isOpen: false,
            })}
          onSave={(habit, currentHabit) => {
            modalState = {
              isOpen: false,
            };
            if (currentHabit == null) {
              habits = [...habits, habit];
            } else {
              habits = habits.map((h) =>
                h.noteKey === currentHabit.noteKey ? habit : h,
              );
            }
            saveSettings({
              habits,
            });
          }}
          onDelete={(habit) => {
            modalState = {
              isOpen: false,
            };
            habits = habits.filter((h) => h.noteKey !== habit.noteKey);
            saveSettings({
              habits,
            });
          }}
          currentHabit={modalState.currentHabit}
        />
      {/if}
    </div>
    {#if activeHabit != null}
      <div class="flex flex-col px-4">
        <div class="flex flex-row items-center">
          <h2 class="self-start flex-grow">{activeHabit.name}</h2>
          <div class="flex justify-end">
            <Button
              outline={true}
              class="shadow-none! p-2!"
              on:click={() =>
                (modalState = {
                  isOpen: true,
                  currentHabit: activeHabit,
                })}
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
      </div>
    {/if}
  </div>
</div>
