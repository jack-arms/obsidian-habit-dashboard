<script lang="ts">
  import { App } from "obsidian";
  import type { Habit, ObsidianHabitDashboardPluginSettings } from "./main";
  import { TabItem, Tabs } from "flowbite-svelte";
  import HabitEditModal from "./HabitEditModal.svelte";
  import { getHabitProgressByDate } from "./utils";
  import HabitCalendarMasterDetail from "./calendar_master_detail/HabitCalendarMasterDetail.svelte";
  import HabitOverview from "./habit_overview/HabitOverview.svelte";
  interface Props {
    app: App;
    settings: ObsidianHabitDashboardPluginSettings;
    saveSettings: (settings: ObsidianHabitDashboardPluginSettings) => void;
  }

  let { app, settings, saveSettings }: Props = $props();

  let habits = $state<Habit[]>(settings.habits);

  let tab = $state<"overview" | "calendar_master_detail">("overview");

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

  const onEdit = (habit: Habit | null) =>
    (modalState = {
      isOpen: true,
      currentHabit: habit,
    });
</script>

<div class="flex flex-col h-full p-1">
  <h1 class="font-bold text-center">Obsidian Habit Dashboard</h1>
  <Tabs
    contentClass="flex flex-grow border-t border-gray-300"
    activeClasses="bg-gray-100! shadow-none!"
    inactiveClasses="shadow-none!"
    divider={false}
  >
    <TabItem
      open={tab === "overview"}
      title="Overview"
      on:click={() => tab === "overview"}
      divClass="flex flex-grow"
    >
      <HabitOverview {habits} {habitProgressByDate} {onEdit} />
    </TabItem>
    <TabItem
      open={tab === "calendar_master_detail"}
      title="Calendar"
      on:click={() => tab === "calendar_master_detail"}
      divClass="flex flex-grow"
    >
      <HabitCalendarMasterDetail {habits} {habitProgressByDate} {onEdit} />
    </TabItem>
  </Tabs>
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
