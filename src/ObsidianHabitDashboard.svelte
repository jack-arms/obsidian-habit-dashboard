<script lang="ts">
  import { App, getIcon } from "obsidian";
  import type { ObsidianHabitDashboardPluginSettings } from "./main";
  import { Plus } from "lucide-svelte";
  interface Props {
    app: App;
    settings: ObsidianHabitDashboardPluginSettings;
    saveSettings: (settings: ObsidianHabitDashboardPluginSettings) => void;
  }

  let { app, settings, saveSettings }: Props = $props();

  const onClick = () => {
    console.log("I am clicked");
  };
</script>

<div class="dashboard-container">
  <h1>Obsidian Habit Dashboard</h1>
  {#if settings.habits.length === 0}
    <button onclick={onClick}> <Plus />New habit </button>
  {/if}
</div>

<style>
  .dashboard-container {
    border: 1px solid black;
  }

  .dashboard-container > button:active {
    background: blue;
  }
</style>
