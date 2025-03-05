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
    | { isOpen: true; habit: Habit; currentHabit: Habit | null }
    | { isOpen: false }
  >({
    isOpen: false,
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
            habit: { ...habit },
            currentHabit: habit,
          })}
      />
    </div>
  {/each}
  <HabitEditModal
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
      habits = habits.filter((h) => h.noteKey !== habit.noteKey);
      modalState = {
        isOpen: false,
      };
      saveSettings({
        habits,
      });
    }}
    {modalState}
  />
  <Button
    on:click={() => {
      modalState = {
        isOpen: true,
        habit: {
          name: "",
          noteKey: "",
        },
        currentHabit: null,
      };
    }}
    class="bg-primary-500! hover:bg-primary-600! active:bg-primary-700!"
  >
    <Plus class="w-5 h-5" /> New
  </Button>
</div>
