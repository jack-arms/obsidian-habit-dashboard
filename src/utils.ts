import type { Habit } from "./main";
import type { StreakType } from "./scrollable_calendar/CalendarStreakDay.svelte";
import type { GoalTimeUnit, GoalIntervalTimeUnit } from "./types";
import type { App } from "obsidian";

export function goalTimeUnitToString(
  goalTimeUnit: GoalTimeUnit,
  time: number | null = null
) {
  switch (goalTimeUnit) {
    case null:
      return time == null ? "time(s)" : time === 1 ? "time" : "times";
    case "m":
      return time == null ? "minute(s)" : time === 1 ? "minute" : "minutes";
    case "h":
      return time == null ? "hour(s)" : time === 1 ? "hour" : "hours";
  }
}

export function goalIntervalTimeUnitToString(
  intervalTimeUnit: GoalIntervalTimeUnit,
  interval: number | null = null
) {
  switch (intervalTimeUnit) {
    case "d":
      return interval == null ? "day(s)" : interval === 1 ? "day" : "days";
    case "w":
      return interval == null ? "week(s)" : interval === 1 ? "week" : "weeks";
    case "m":
      return interval == null
        ? "month(s)"
        : interval === 1
        ? "month"
        : "months";
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

export function getHabitGoalProgress(
  goalInfo: NonNullable<Habit["goalInfo"]>,
  habitProgress: Array<{
    date: string;
    value: string;
  }>
): number {
  const days = goalIntervalToDays(goalInfo.interval, goalInfo.intervalTimeUnit);
  let startDate = new Date(habitProgress[habitProgress.length - 1].date);
  startDate.setDate(startDate.getDate() - days);

  let progress = 0;
  let i = habitProgress.length - 1;
  let date = new Date(habitProgress[i].date);
  while (date.getTime() > startDate.getTime()) {
    if (goalInfo.goalTimeUnit == null) {
      progress++;
    } else {
      progress += Number(habitProgress[i].value); // TODO support non-numeric data, e.g. "30m" in note data
    }
    console.log({ progress, entry: habitProgress[i] });
    i--;
    date = new Date(habitProgress[i].date);
  }
  return progress;
}

export function getHabitGoalProgressString(
  goalInfo: NonNullable<Habit["goalInfo"]>,
  habitGoalProgress: number
) {
  return (
    `${habitGoalProgress} / ${goalInfo.goal} ${goalTimeUnitToString(
      goalInfo.goalTimeUnit,
      habitGoalProgress
    )}` +
    ", " +
    (goalInfo.interval === 1 && goalInfo.intervalTimeUnit === "d"
      ? "today"
      : `past ${
          goalInfo.interval > 1 ? goalInfo.interval : ""
        } ${goalIntervalTimeUnitToString(
          goalInfo.intervalTimeUnit,
          goalInfo.interval
        )}`)
  );
}

export function goalIntervalToDays(
  interval: number,
  intervalTimeUnit: GoalIntervalTimeUnit
) {
  switch (intervalTimeUnit) {
    case "d":
      return interval;
    case "w":
      return interval * 7;
    case "m":
      return interval * 30;
  }
}
