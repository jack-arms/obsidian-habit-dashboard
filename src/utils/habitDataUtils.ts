import {
  HabitTimeProgressUnits,
  type AggregatedHabitProgress,
  type Habit,
  type HabitDayProgress,
  type HabitTimeProgressUnit,
} from "src/types";
import type { StreakType } from "src/scrollable_calendar/CalendarDayWithNoteData.svelte";
import {
  goalIntervalToDays,
  latestHabitProgress,
  localDateKeyFormat,
} from "./utils";
import type { App } from "obsidian";
import star from "lucide-svelte/icons/star";

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
    unit: match[2] ?? null,
  };
}

export function getAggregatedHabitProgress(
  habitProgress: {
    [date: string]: HabitDayProgress;
  },
  since: Date | null = null
): AggregatedHabitProgress {
  let times = 0;
  let minutes = 0;
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

    if (unit in HabitTimeProgressUnits) {
      const { toBase } = HabitTimeProgressUnits[unit as HabitTimeProgressUnit];
      minutes += value * toBase;
      return;
    }

    if (!(unit in progress)) {
      progress[unit] = 0;
    }
    progress[unit] += value;
  });

  return {
    times,
    minutes,
    progress,
    untypedProgress,
  };
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
  if (!(goalUnit in HabitTimeProgressUnits)) {
    // custom unit
    return aggregatedProgress.progress[goalUnit] ?? 0;
  }

  const minutes = aggregatedProgress.minutes;
  const { toBase } = HabitTimeProgressUnits[goalUnit as HabitTimeProgressUnit];
  return minutes * toBase;
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
