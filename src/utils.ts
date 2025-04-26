import type { StreakType } from "./scrollable_calendar/CalendarDayWithNoteData.svelte";
import {
  type Habit,
  type GoalIntervalTimeUnit,
  type HabitDayProgress,
  type AggregatedHabitProgress,
} from "./types";
import type { App } from "obsidian";
import {
  convertUnit,
  HabitProgressUnits,
  type HabitProgressUnit,
  type HabitProgressUnitCategory,
} from "./units";

export function goalUnitToString(
  unit: string | null,
  value: number | null = null
) {
  switch (unit) {
    case null:
      return value == null ? "time(s)" : value === 1 ? "time" : "times";
    case "m":
      return value == null ? "minute(s)" : value === 1 ? "minute" : "minutes";
    case "h":
      return value == null ? "hour(s)" : value === 1 ? "hour" : "hours";
  }
  return unit;
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

export function getHabitProgressByDate(
  app: App,
  habitNoteKeys: Array<string>
): {
  [noteKey: string]: {
    [noteHref: string]: HabitDayProgress;
  };
} {
  const data: {
    [noteKey: string]: {
      [noteHref: string]: HabitDayProgress;
    };
  } = {};
  habitNoteKeys.forEach((habitNoteKey) => {
    data[habitNoteKey] = {};
  });
  app.vault
    .getMarkdownFiles()
    .filter((f) => !Number.isNaN(new Date(f.basename).getTime()))
    .forEach((f) => {
      const frontMatter = app.metadataCache.getFileCache(f)?.frontmatter;
      if (frontMatter == null) {
        return;
      }
      habitNoteKeys.forEach((habitNoteKey) => {
        if (
          frontMatter[habitNoteKey] != null &&
          frontMatter[habitNoteKey] !== ""
        ) {
          const progress = getFrontmatterDataToProgress(
            String(frontMatter[habitNoteKey])
          );
          data[habitNoteKey][f.basename] = {
            date: f.basename,
            noteHref: f.name,
            ...(progress ?? {
              value: null,
              unit: null,
            }),
          };
        }
      });
    });
  return data;
}

export function getFrontmatterDataToProgress(data: string): {
  value: number;
  unit: string | null;
} | null {
  const match = data.match(/([\d\.]+)(\w+)?/);
  if (match == null || match[1] == null) {
    return null;
  }
  const value = Number.parseFloat(match[1]);
  if (value === Number.NaN) {
    return null;
  }
  return {
    value,
    unit: match[2],
  };
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

export function getStreakDataByHabit(habitProgress: {
  [noteKey: string]: {
    [date: string]: HabitDayProgress;
  };
}): {
  [noteKey: string]: {
    [date: string]: StreakType;
  };
} {
  const data: {
    [noteKey: string]: {
      [date: string]: StreakType;
    };
  } = {};

  Object.keys(habitProgress).forEach((noteKey) => {
    const streakData = getStreakData(habitProgress[noteKey]);
    data[noteKey] = {};
    Object.keys(habitProgress[noteKey]).forEach((date) => {
      data[noteKey][date] = streakData[date];
    });
  });

  return data;
}

export function getStreakData(progress: { [date: string]: HabitDayProgress }): {
  [date: string]: StreakType;
} {
  const streakData: { [date: string]: StreakType } = {};
  Object.values(progress).forEach(({ date }) => {
    const previousDate = (() => {
      const d = new Date(date);
      d.setDate(d.getDate() - 1);
      return localDateKeyFormat(d);
    })();
    const nextDate = (() => {
      const d = new Date(date);
      d.setDate(d.getDate() + 1);
      return localDateKeyFormat(d);
    })();

    const hasPreviousDay = progress[previousDate] != null;
    const hasNextDay = progress[nextDate] != null;
    if (!hasPreviousDay && !hasNextDay) {
      streakData[date] = "isolated";
    } else if (!hasPreviousDay && hasNextDay) {
      streakData[date] = "start";
    } else if (hasPreviousDay && !hasNextDay) {
      streakData[date] = "end";
    } else {
      streakData[date] = "middle";
    }
  });
  return streakData;
}

export function localDateKeyFormat(date: Date) {
  const localDate = new Date(date.valueOf());
  localDate.setMinutes(localDate.getMinutes() + localDate.getTimezoneOffset());
  return [
    localDate.getFullYear(),
    String(localDate.getMonth() + 1).padStart(2, "0"),
    String(localDate.getDate()).padStart(2, "0"),
  ].join("-");
}

export function getAggregatedHabitProgress(
  habitProgress: {
    [date: string]: HabitDayProgress;
  },
  since: Date | null = null
): AggregatedHabitProgress {
  let times = 0;
  let untypedProgress = 0;
  let progress: {
    [unit: string]: number;
  } = {};
  Object.values(habitProgress).forEach(({ date, unit, value }) => {
    if (since != null && new Date(date).getTime() < since.getTime()) {
      return;
    }
    times++;
    if (value == null) {
      return;
    }

    if (unit == null) {
      untypedProgress += value;
      return;
    }
    if (!(unit in progress)) {
      progress[unit] = 0;
    }
    progress[unit] += value;
  });

  return {
    times,
    untypedProgress,
    progress,
  };
}

export function getConsolidatedProgressByUnit(progress: {
  [unit: string]: number;
}): { [unit: string]: number } {
  let baseUnitsByCategory: {
    [category in HabitProgressUnitCategory]?: number;
  } = {};
  let customUnits: { [unit: string]: number } = {};

  for (const unit in progress) {
    if (unit in HabitProgressUnits) {
      const { toBase, category } =
        HabitProgressUnits[unit as HabitProgressUnit];
      let current = (baseUnitsByCategory[category] ?? 0) + toBase;
      baseUnitsByCategory[category] = current;
    } else {
      customUnits[unit] = progress[unit];
    }
  }

  const joined: { [unit: string]: number } = {};
  for (const unit in customUnits) {
    joined[unit] = customUnits[unit];
  }
  for (const category in baseUnitsByCategory) {
    const totalBaseUnits =
      baseUnitsByCategory[category as HabitProgressUnitCategory];
    if (totalBaseUnits != null) {
      const consolidatedUnits = getConsolidatedUnitsForCategory(
        category as HabitProgressUnitCategory,
        totalBaseUnits
      );
      for (const unit in consolidatedUnits) {
        joined[unit] = consolidatedUnits[unit];
      }
    }
  }
  return joined;
}

export function getConsolidatedUnitsForCategory(
  category: HabitProgressUnitCategory,
  baseUnitProgress: number
): { [unit: string]: number } {
  const sortedUnits = Object.keys(HabitProgressUnits)
    .map((k) => ({
      unit: k,
      ...HabitProgressUnits[k as HabitProgressUnit],
    }))
    .filter((u) => u.category === category)
    .sort((a, b) => b.toBase - a.toBase);

  const consolidatedUnits: { [unit: string]: number } = {};
  let i = 0;
  while (baseUnitProgress > 0) {
    consolidatedUnits[sortedUnits[i].unit] = Math.floor(
      baseUnitProgress / sortedUnits[i].toBase
    );
    baseUnitProgress = baseUnitProgress % sortedUnits[i].toBase;
    i++;
  }
  return consolidatedUnits;
}

export function getHabitGoalProgress(
  goalInfo: NonNullable<Habit["goalInfo"]>,
  habitProgress: { [date: string]: HabitDayProgress }
): number {
  const days = goalIntervalToDays(goalInfo.interval, goalInfo.intervalTimeUnit);
  let latestDate = new Date(
    latestHabitProgress(Object.values(habitProgress)).date
  );

  const lookbackDays =
    latestDate.getTime() === new Date().getTime() ? days - 1 : days;
  let startDate = new Date();
  startDate.setDate(startDate.getDate() - lookbackDays);
  startDate.setHours(0);
  startDate.setMinutes(0);
  startDate.setSeconds(0);
  startDate.setMilliseconds(0);

  const aggregatedProgress = getAggregatedHabitProgress(
    habitProgress,
    startDate
  );

  const { goalUnit } = goalInfo;
  if (goalUnit == null) {
    // number of times
    return aggregatedProgress.times;
  }
  if (!(goalUnit in HabitProgressUnits)) {
    // custom unit
    return aggregatedProgress.progress[goalUnit] ?? 0;
  }

  // return all progress that can be converted to the goal unit
  let goalProgress = 0;
  for (const unit in aggregatedProgress.progress) {
    if (unit in HabitProgressUnits) {
      goalProgress +=
        convertUnit(
          aggregatedProgress.progress[unit],
          unit as HabitProgressUnit,
          goalUnit as HabitProgressUnit
        ) ?? 0;
    }
  }
  return goalProgress;
}

export function getHabitGoalProgressString(
  goalInfo: NonNullable<Habit["goalInfo"]>,
  habitGoalProgress: number
) {
  return (
    `${habitGoalProgress} / ${goalInfo.goal} ${goalUnitToString(
      goalInfo.goalUnit,
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

export function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const modMinutes = minutes % 60;
  const hourString = hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}` : "";
  const minuteString =
    modMinutes > 0 ? `${modMinutes} minute${modMinutes > 1 ? "s" : ""}` : "";
  return [hourString, minuteString].join(", ");
}

export function getLocalDate(date: Date) {
  date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
  return date;
}

export function latestHabitProgress(habitProgress: HabitDayProgress[]) {
  return habitProgress.reduce(
    (a, b) => (a.date > b.date ? a : b),
    habitProgress[0]
  );
}
