import { Plugin, WorkspaceLeaf } from "obsidian";
import {
  OBSIDIAN_HABIT_DASHBOARD_VIEW,
  ObsidianHabitDashboardView,
} from "./ObsidianHabitDashboardView";

interface ObsidianHabitDashboardPluginSettings {}

const DEFAULT_SETTINGS: ObsidianHabitDashboardPluginSettings = {};

export default class ObsidianHabitDashboardPlugin extends Plugin {
  settings: ObsidianHabitDashboardPluginSettings;

  async onload() {
    await this.loadSettings();
    this.registerView(
      OBSIDIAN_HABIT_DASHBOARD_VIEW,
      (leaf) => new ObsidianHabitDashboardView(leaf)
    );
    this.addRibbonIcon("clipboard-list", "Habit Dashboard", () => {
      this.activateView();
    });
  }

  onunload() {}

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }

  async activateView() {
    const { workspace } = this.app;

    workspace.setActiveLeaf;

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
