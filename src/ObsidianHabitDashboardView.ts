import { ItemView, WorkspaceLeaf } from "obsidian";
import { mount, unmount } from "svelte";
import ObsidianHabitDashboard from "./ObsidianHabitDashboard.svelte";
import type { ObsidianHabitDashboardPluginSettings } from "./main";

export const OBSIDIAN_HABIT_DASHBOARD_VIEW = "obsidian-habit-dashboard-view";

export class ObsidianHabitDashboardView extends ItemView {
  dashboard: ReturnType<typeof ObsidianHabitDashboard> | undefined;
  settings: ObsidianHabitDashboardPluginSettings;
  saveSettings: (settings: Partial<ObsidianHabitDashboardPluginSettings>) => void;
  constructor(
    leaf: WorkspaceLeaf,
    settings: ObsidianHabitDashboardPluginSettings,
    saveSettings: (settings: Partial<ObsidianHabitDashboardPluginSettings>) => void
  ) {
    super(leaf);
    this.settings = settings;
    this.saveSettings = saveSettings;
  }

  getViewType() {
    return OBSIDIAN_HABIT_DASHBOARD_VIEW;
  }

  getDisplayText() {
    return "Habit Dashboard";
  }

  async onOpen() {
    this.dashboard = mount(ObsidianHabitDashboard, {
      target: this.contentEl,
      props: {
        app: this.app,
        settings: this.settings,
        saveSettings: this.saveSettings,
        isDev: Boolean(process.env.NODE_ENV),
      },
    });
  }

  async onClose() {
    if (this.dashboard) {
      unmount(this.dashboard);
    }
  }
}
