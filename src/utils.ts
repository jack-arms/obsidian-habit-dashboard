import type { StreakType } from "./scrollable_calendar/CalendarDayWithNoteData.svelte";
import type {
  Habit,
  GoalIntervalTimeUnit,
  HabitDayProgress,
  HabitProgressUnit,
} from "./types";
import type { App } from "obsidian";

export function goalUnitToString(
  unit: HabitProgressUnit,
  time: number | null = null
) {
  switch (unit) {
    case null:
      return time == null ? "time(s)" : time === 1 ? "time" : "times";
    case "m":
      return time == null ? "minute(s)" : time === 1 ? "minute" : "minutes";
    case "h":
      return time == null ? "hour(s)" : time === 1 ? "hour" : "hours";
  }
  return "";
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
  unit: HabitProgressUnit | null;
} | null {
  const match = data.match(/([\d\.]+)(m|h)?/);
  if (match == null || match[1] == null) {
    return null;
  }
  const value = Number.parseFloat(match[1]);
  if (value === Number.NaN) {
    return null;
  }
  return {
    value,
    unit: match[2] as HabitProgressUnit | null,
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

export function getHabitProgressWithStreakType(habitProgress: {
  [noteKey: string]: {
    [date: string]: HabitDayProgress;
  };
}): {
  [noteKey: string]: {
    [date: string]: HabitDayProgress & {
      streakType: StreakType;
    };
  };
} {
  const data: {
    [noteKey: string]: {
      [date: string]: HabitDayProgress & { streakType: StreakType };
    };
  } = {};

  Object.keys(habitProgress).forEach((noteKey) => {
    const streakData = getStreakData(habitProgress[noteKey]);
    data[noteKey] = {};
    Object.keys(habitProgress[noteKey]).forEach((date) => {
      data[noteKey][date] = {
        ...habitProgress[noteKey][date],
        streakType: streakData[date],
      };
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

export function getHabitProgressSince(
  habitProgress: {
    [date: string]: HabitDayProgress & {
      streakType: StreakType;
    };
  },
  since: Date,
  interpretUntypedNumberAsMinutes: boolean = false
): {
  totalTimes: number;
} {
  let totalTimes = 0;
  Object.values(habitProgress).forEach(({ date, unit, value }) => {
    if (new Date(date).getTime() < since.getTime()) {
      return;
    }
    totalTimes++;
    if (
      (unit != null && ["m", "h"].includes(unit)) ||
      (unit == null && interpretUntypedNumberAsMinutes)
    ) {
      // TODO: handle progress for different types of units
    }
  });
  return {
    totalTimes,
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

  let progress = 0;
  Object.values(habitProgress).forEach(({ date, unit, value }) => {
    if (new Date(date).getTime() < startDate.getTime()) {
      return;
    }
    switch (goalInfo.goalUnit) {
      case null:
      case "x":
        if (value != null) {
          progress++;
        }
        break;
      case "m":
        if (unit === "m" && value != null) {
          progress += value;
        } else if (unit === "h" && value != null) {
          progress += value * 60;
        }
        break;
      case "h":
        if (unit === "m" && value != null) {
          progress += value / 60.0;
        } else if (unit === "h" && value != null) {
          progress += value;
        }
        break;
      default:
      // TODO: handle other goal units
    }
  });
  return progress;
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
