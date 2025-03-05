<script lang="ts">
  import { App } from "obsidian";
  import type { Habit, ObsidianHabitDashboardPluginSettings } from "./main";
  import { Flag, Plus } from "lucide-svelte";
  import { Card, Button } from "flowbite-svelte";
  import HabitEditModal from "./HabitEditModal.svelte";
  import { goalIntervalTimeUnitToString, goalTimeUnitToString } from "./utils";
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
</script>

<div>
  <h1 class="font-bold underline">Obsidian Habit Dashboard</h1>
  <Button
    on:click={() => {
      modalState = {
        isOpen: true,
        habit: null,
      };
    }}
    class="bg-primary-500! hover:bg-primary-600! active:bg-primary-700!"
  >
    <Plus class="w-5 h-5" />New</Button
  >
  {#each habits as habit}
    <Card>
      <h5 class="mb-2 text-2xl font-bold text-gray-900">
        {habit.name}
      </h5>
      {#if habit.goalInfo != null}
        <span>
          <Flag class="inline mr-2" />{habit.goalInfo.goal}
          {goalTimeUnitToString(
            habit.goalInfo.goalTimeUnit,
            habit.goalInfo.goal,
          )}
          every {habit.goalInfo.interval}
          {goalIntervalTimeUnitToString(
            habit.goalInfo.intervalTimeUnit,
            habit.goalInfo.interval,
          )}
        </span>
      {/if}
    </Card>
  {/each}
  <HabitEditModal
    open={modalState.isOpen}
    onClose={(habit) => {
      modalState = {
        isOpen: false,
      };
      habits.push(habit);
      saveSettings({
        habits,
      });
    }}
    habit={modalState.isOpen ? modalState.habit : null}
  />
</div>
