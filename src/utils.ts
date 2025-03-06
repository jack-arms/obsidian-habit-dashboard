import type { GoalTimeUnit, GoalIntervalTimeUnit } from "./types";
import type { App } from "obsidian";

export function goalTimeUnitToString(
  goalTimeUnit: GoalTimeUnit,
  time: number | null = null
) {
  switch (goalTimeUnit) {
    case null:
      return time == null ? "time(s)" : time > 1 ? "times" : "time";
    case "m":
      return time == null ? "minute(s)" : time > 1 ? "minutes" : "hour";
    case "h":
      return time == null ? "hour(s)" : time > 1 ? "hours" : "hour";
  }
}

export function goalIntervalTimeUnitToString(
  intervalTimeUnit: GoalIntervalTimeUnit,
  interval: number | null = null
) {
  switch (intervalTimeUnit) {
    case "d":
      return interval == null ? "day(s)" : interval > 1 ? "days" : "days";
    case "w":
      return interval == null ? "week(s)" : interval > 1 ? "weeks" : "weeks";
    case "m":
      return interval == null ? "month(s)" : interval > 1 ? "months" : "months";
  }
}

export function getHabitProgressByDate(app: App, habitNoteKeys: Array<string>) {
  const frontmatterPerDate = app.vault
    .getMarkdownFiles()
    .filter((f) => {
      return !Number.isNaN(new Date(f.basename).getTime());
    })
    .map((f) => {
      const frontMatter = app.metadataCache.getFileCache(f)?.frontmatter;
      if (frontMatter == null) {
        return {};
      }
      const habitsWithData: {
        [noteKey: string]: { date: string; value: string };
      } = {};
      habitNoteKeys.forEach((habitNoteKeys) => {
        if (
          frontMatter[habitNoteKeys] != null &&
          frontMatter[habitNoteKeys] !== ""
        ) {
          habitsWithData[habitNoteKeys] = {
            date: f.basename,
            value: frontMatter[habitNoteKeys],
          };
        }
      });
      return habitsWithData;
    })
    .filter((data) => Object.keys(data).length > 0);

  const habitProgressByDate = frontmatterPerDate.reduce((acc, obj) => {
    Object.keys(obj).forEach((noteKey) => {
      if (noteKey in acc) {
        acc[noteKey].push(obj[noteKey]);
      } else {
        acc[noteKey] = [obj[noteKey]];
      }
    });
    return acc;
  }, {} as { [noteKey: string]: Array<{ date: string; value: string }> });

  Object.keys(habitProgressByDate).forEach((habitNoteKey) => {
    habitProgressByDate[habitNoteKey].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  });
  return habitProgressByDate;
}
