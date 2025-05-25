import { Plugin, WorkspaceLeaf } from "obsidian";
import {
  OBSIDIAN_HABIT_DASHBOARD_VIEW,
  ObsidianHabitDashboardView,
} from "./ObsidianHabitDashboardView";
import type { Habit } from "./types";
import ObsidianHabitDashboardSettingsTab from "./ObsidianHabitDashboardSettingsTab";

export interface ObsidianHabitDashboardPluginSettings {
  habits: Habit[];
  dateFormat: string | null;
}

const DEFAULT_SETTINGS: ObsidianHabitDashboardPluginSettings = {
  habits: [],
  dateFormat: null,
};

export default class ObsidianHabitDashboardPlugin extends Plugin {
  settings: ObsidianHabitDashboardPluginSettings;

  async onload() {
    this.settings = await this.loadSettings();
    this.addSettingTab(new ObsidianHabitDashboardSettingsTab(this.app, this));
    this.registerView(
      OBSIDIAN_HABIT_DASHBOARD_VIEW,
      (leaf) =>
        new ObsidianHabitDashboardView(leaf, this.settings, (settings) =>
          this.saveSettings({
            ...this.settings,
            ...settings,
          })
        )
    );
    this.addRibbonIcon("circle-gauge", "Habit Dashboard", () => {
      this.activateView();
    });
  }

  onunload() {}

  async loadSettings() {
    return Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings(settings: ObsidianHabitDashboardPluginSettings) {
    await this.saveData(settings);
  }

  async activateView() {
    const { workspace } = this.app;

    let leaf: WorkspaceLeaf | null = null;
    const leaves = workspace.getLeavesOfType(OBSIDIAN_HABIT_DASHBOARD_VIEW);

    if (leaves.length > 0) {
      leaf = leaves[0];
    } else {
      leaf = workspace.getLeaf("tab");
    }

    if (leaf == null) {
      console.error("Could not load leaf for habit dashboard.");
      return;
    }
    await leaf.setViewState({
      type: OBSIDIAN_HABIT_DASHBOARD_VIEW,
      active: true,
    });

    workspace.revealLeaf(leaf);
  }
}
