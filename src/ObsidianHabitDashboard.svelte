<script lang="ts">
  import { App } from "obsidian";
  import { type Habit } from "./types";
  import type { ObsidianHabitDashboardPluginSettings } from "./main";
  import { TabItem, Tabs } from "flowbite-svelte";
  import HabitEditModal, {
    type HabitEditModalState,
  } from "./habit_edit/HabitEditModal.svelte";
  import { getHabitProgressByDate } from "./utils/habitDataUtils";
  import HabitCalendarMasterDetail from "./calendar_master_detail/HabitCalendarMasterDetail.svelte";
  import HabitOverview from "./habit_overview/HabitOverview.svelte";
  import HabitAccordion from "./habit_overview/HabitAccordion.svelte";
  import ComponentLibrary from "./component_library/ComponentLibrary.svelte";
  import { setContext } from "svelte";
  import { moment } from "obsidian";
  import { ObsidianHabitDashboardView } from "./ObsidianHabitDashboardView";

  interface Props {
    app: App;
    settings: ObsidianHabitDashboardPluginSettings;
    saveSettings: (settings: ObsidianHabitDashboardPluginSettings) => void;
    isDev: boolean;
  }

  let { app, settings, saveSettings, isDev }: Props = $props();

  setContext<App>("obsidian-app", app);

  let habits = $state<Habit[]>(settings.habits);
  let openHabitKey = $state<string | null>(
    (() => (habits.length > 0 ? habits[0].noteKey : null))(),
  );

  let lastSync = $state<string>("");

  app.workspace.on("active-leaf-change", (leaf) => {
    if (leaf?.view instanceof ObsidianHabitDashboardView) {
      console.log("sync");
      lastSync = moment().toISOString();
    }
  });

  let tab = $state<
    | "overview"
    | "calendar_master_detail"
    | "calendar_accordion"
    | "component_library"
  >("overview");

  let modalState = $state<HabitEditModalState>({
    open: false,
  });

  let habitProgressByDate = $derived(
    ((_) =>
      getHabitProgressByDate(
        app,
        habits.map((h) => h.noteKey),
      ))(lastSync),
  );

  const onEdit = (habit: Habit | null) =>
    (modalState = {
      open: true,
      currentHabit: habit,
    });

  const onMoveHabit = (habit: Habit, change: 1 | -1) => {
    const habitIndex = habits.findIndex((h) => h.noteKey === habit.noteKey);
    if (habitIndex < 0) {
      return;
    }
    if (habitIndex + change < 0 || habitIndex + change > habits.length - 1) {
      return;
    }
    const temp = habits[habitIndex + change];
    habits[habitIndex + change] = habits[habitIndex];
    habits[habitIndex] = temp;
  };
</script>

<div class="flex flex-col h-full">
  <h1
    class="font-bold text-left ml-4 mb-0! pb-4 border-b border-(--background-modifier-border)"
  >
    Obsidian Habit Dashboard
  </h1>
  {#if isDev}
    <HabitOverview {habits} {habitProgressByDate} {onEdit} {onMoveHabit} />
  {:else}
    <Tabs
      contentClass="flex flex-grow border-t rounded-none bg-(--background-primary)!"
      activeClasses="shadow-none!"
      inactiveClasses="shadow-none!"
      divider={false}
    >
      <TabItem
        open={tab === "overview"}
        title="Overview"
        on:click={() => tab === "overview"}
        divClass="flex flex-grow"
      >
        <HabitOverview
          {habits}
          {habitProgressByDate}
          {onEdit}
          {onMoveHabit}
          bind:openHabitKey
        />
      </TabItem>
      <TabItem
        open={tab === "calendar_master_detail"}
        title="Calendar"
        on:click={() => tab === "calendar_master_detail"}
        divClass="flex flex-grow"
      >
        <HabitCalendarMasterDetail {habits} {habitProgressByDate} {onEdit} />
      </TabItem>
      <TabItem
        open={tab === "calendar_accordion"}
        title="Accordion"
        on:click={() => tab === "calendar_accordion"}
        divClass="flex flex-grow"
      >
        <HabitAccordion {habits} {habitProgressByDate} {onEdit} {onMoveHabit} />
      </TabItem>
      {#if isDev}
        <TabItem
          open={tab === "component_library"}
          title="Component library"
          on:click={() => tab === "component_library"}
          divClass="flex flex-grow"
        >
          <ComponentLibrary />
        </TabItem>
      {/if}
    </Tabs>
  {/if}
  <HabitEditModal
    bind:open={modalState.open}
    onClose={() =>
      (modalState = {
        open: false,
      })}
    onSave={(habit, currentHabit) => {
      modalState = {
        open: false,
      };
      if (currentHabit == null) {
        habits = [...habits, habit];
        openHabitKey = habit.noteKey;
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
        open: false,
      };
      habits = habits.filter((h) => h.noteKey !== habit.noteKey);
      saveSettings({
        habits,
      });
    }}
    currentHabit={modalState.open ? modalState.currentHabit : null}
  />
</div>
