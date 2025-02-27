import { ItemView, WorkspaceLeaf } from "obsidian";
import { mount, unmount } from "svelte";
import ObsidianHabitDashboard from "./ObsidianHabitDashboard.svelte";

export const OBSIDIAN_HABIT_DASHBOARD_VIEW = "obsidian-habit-dashboard-view";

export class ObsidianHabitDashboardView extends ItemView {
  counter: ReturnType<typeof ObsidianHabitDashboard> | undefined;
  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType() {
    return OBSIDIAN_HABIT_DASHBOARD_VIEW;
  }

  getDisplayText() {
    return "Habit Dashboard";
  }

  async onOpen() {
    this.counter = mount(ObsidianHabitDashboard, {
      target: this.contentEl,
    });
  }

  async onClose() {
    if (this.counter) {
      unmount(this.counter);
    }
  }
}
