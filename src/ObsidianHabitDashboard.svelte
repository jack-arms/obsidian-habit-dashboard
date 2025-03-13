<script lang="ts">
  import { App } from "obsidian";
  import type { Habit, ObsidianHabitDashboardPluginSettings } from "./main";
  import { Button, Listgroup } from "flowbite-svelte";
  import HabitEditModal from "./HabitEditModal.svelte";
  import HabitCard from "./HabitCard.svelte";
  import { getHabitProgressByDate } from "./utils";
  import ScrollableCalendar from "./scrollable_calendar/ScrollableCalendar.svelte";
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
</script>

<div class="flex flex-col">
  <h1 class="font-bold underline">Obsidian Habit Dashboard</h1>
  <div class="flex flex-row">
    <div class="flex flex-col max-w-sm">
      <div class="flex flex-row justify-between items-center">
        <h5
          class="text-xl font-bold leading-none text-gray-900 dark:text-white"
        >
          Habits
        </h5>
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
      <ScrollableCalendar centerDate={new Date()} />
    {/if}
  </div>
</div>
