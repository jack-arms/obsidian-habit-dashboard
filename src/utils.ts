import type { StreakType } from "./scrollable_calendar/CalendarStreakDay.svelte";
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
    .filter((f) => !Number.isNaN(new Date(f.basename).getTime()))
    .map((f) => {
      const frontMatter = app.metadataCache.getFileCache(f)?.frontmatter;
      if (frontMatter == null) {
        return {};
      }
      const habitsWithData: {
        [noteKey: string]: { date: string; value: string };
      } = {};
      habitNoteKeys.forEach((habitNoteKey) => {
        if (
          frontMatter[habitNoteKey] != null &&
          frontMatter[habitNoteKey] !== ""
        ) {
          habitsWithData[habitNoteKey] = {
            date: dateKeyFormat(new Date(f.basename)),
            value: frontMatter[habitNoteKey],
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

export function daysBetween(date1: Date, date2: Date) {
  return (
    Math.floor(date1.getTime() / (1000 * 3600 * 24)) -
    Math.floor(date2.getTime() / (1000 * 3600 * 24))
  );
}

export function areDatesSameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function getHabitDatesToStreakType(habitProgress: {
  [noteKey: string]: {
    date: string;
    value: string;
  }[];
}) {
  const datesToStreakTypePerHabit: {
    [noteKey: string]: {
      [date: string]: StreakType;
    };
  } = {};
  Object.keys(habitProgress).forEach((noteKey) => {
    const datesToStreakType: { [date: string]: StreakType } = {};
    for (let i = 0; i < habitProgress[noteKey].length; i++) {
      const date = new Date(habitProgress[noteKey][i].date);
      const previousDay = new Date(date.valueOf());
      previousDay.setDate(previousDay.getDate() - 1);
      const nextDay = new Date(date.valueOf());
      nextDay.setDate(nextDay.getDate() + 1);

      const hasPreviousDay =
        i != 0 &&
        areDatesSameDay(
          previousDay,
          new Date(habitProgress[noteKey][i - 1].date)
        );
      const hasNextDay =
        i != habitProgress[noteKey].length - 1 &&
        areDatesSameDay(nextDay, new Date(habitProgress[noteKey][i + 1].date));
      if (!hasPreviousDay && !hasNextDay) {
        datesToStreakType[habitProgress[noteKey][i].date] = "isolated";
      } else if (!hasPreviousDay && hasNextDay) {
        datesToStreakType[habitProgress[noteKey][i].date] = "start";
      } else if (hasPreviousDay && !hasNextDay) {
        datesToStreakType[habitProgress[noteKey][i].date] = "end";
      } else {
        datesToStreakType[habitProgress[noteKey][i].date] = "middle";
      }
    }
    datesToStreakTypePerHabit[noteKey] = datesToStreakType;
  });
  return datesToStreakTypePerHabit;
}

export function dateKeyFormat(date: Date) {
  return date.toISOString().split("T")[0];
}
