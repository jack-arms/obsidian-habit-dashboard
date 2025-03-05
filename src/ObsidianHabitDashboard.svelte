<script lang="ts">
  import { App } from "obsidian";
  import type { Habit, ObsidianHabitDashboardPluginSettings } from "./main";
  import { Plus } from "lucide-svelte";
  import { Button } from "flowbite-svelte";
  import HabitEditModal from "./HabitEditModal.svelte";
  import HabitCard from "./HabitCard.svelte";
  interface Props {
    app: App;
    settings: ObsidianHabitDashboardPluginSettings;
    saveSettings: (settings: ObsidianHabitDashboardPluginSettings) => void;
  }

  let { app, settings, saveSettings }: Props = $props();

  let habits = $state<Habit[]>(settings.habits);

  let modalState = $state<
    { isOpen: true; habit: Habit | null } | { isOpen: false }
  >({
    isOpen: false,
  });

  $effect(() => {
    if (modalState.isOpen) {
      console.log(modalState.habit);
    }
  });
</script>

<div class="flex flex-col max-w-sm">
  <h1 class="font-bold underline">Obsidian Habit Dashboard</h1>
  {#each habits as habit}
    <div class="py-2">
      <HabitCard
        {habit}
        onEdit={() =>
          (modalState = {
            isOpen: true,
            habit,
          })}
      />
    </div>
  {/each}
  <HabitEditModal
    open={modalState.isOpen}
    onSave={(habit) => {
      modalState = {
        isOpen: false,
      };
      habits.push(habit);
      saveSettings({
        habits,
      });
    }}
    onDelete={(habit) => {
      habits = habits.filter((h) => h.noteKey !== habit.noteKey);
      modalState = {
        isOpen: false,
      };
      saveSettings({
        habits,
      });
    }}
    habit={modalState.isOpen ? modalState.habit : null}
  />
  <Button
    on:click={() => {
      modalState = {
        isOpen: true,
        habit: null,
      };
    }}
    class="bg-primary-500! hover:bg-primary-600! active:bg-primary-700!"
  >
    <Plus class="w-5 h-5" /> New
  </Button>
</div>
