import { Plugin, WorkspaceLeaf } from "obsidian";
import {
  OBSIDIAN_HABIT_DASHBOARD_VIEW,
  ObsidianHabitDashboardView,
} from "./ObsidianHabitDashboardView";
import type { GoalTimeUnit, GoalIntervalTimeUnit } from "./types";

export interface ObsidianHabitDashboardPluginSettings {
  habits: Habit[];
}

export interface Habit {
  name: string;
  noteKey: string;
  goalInfo?: {
    goal: number;
    goalTimeUnit: GoalTimeUnit;
    interval: number;
    intervalTimeUnit: GoalIntervalTimeUnit;
  };
}

const DEFAULT_SETTINGS: ObsidianHabitDashboardPluginSettings = {
  habits: [],
};

export default class ObsidianHabitDashboardPlugin extends Plugin {
  async onload() {
    const settings = await this.loadSettings();
    this.registerView(
      OBSIDIAN_HABIT_DASHBOARD_VIEW,
      (leaf) =>
        new ObsidianHabitDashboardView(leaf, settings, (settings) =>
          this.saveSettings(settings)
        )
    );
    this.addRibbonIcon("clipboard-list", "Habit Dashboard", () => {
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
