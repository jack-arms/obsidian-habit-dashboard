import type { StreakType } from "./scrollable_calendar/CalendarStreakDay.svelte";
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
  [noteKey: string]: HabitDayProgress[];
} {
  const frontmatterPerDate = app.vault
    .getMarkdownFiles()
    .filter((f) => !Number.isNaN(new Date(f.basename).getTime()))
    .map((f) => {
      const frontMatter = app.metadataCache.getFileCache(f)?.frontmatter;
      if (frontMatter == null) {
        return {};
      }
      const habitsWithData: {
        [noteKey: string]: HabitDayProgress;
      } = {};
      habitNoteKeys.forEach((habitNoteKey) => {
        if (
          frontMatter[habitNoteKey] != null &&
          frontMatter[habitNoteKey] !== ""
        ) {
          const progress = getFrontmatterDataToProgress(
            String(frontMatter[habitNoteKey])
          );
          habitsWithData[habitNoteKey] = {
            date: f.basename,
            ...(progress ?? {
              value: null,
              unit: null,
            }),
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
  }, {} as { [noteKey: string]: HabitDayProgress[] });

  Object.keys(habitProgressByDate).forEach((habitNoteKey) => {
    habitProgressByDate[habitNoteKey].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  });
  return habitProgressByDate;
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

export function getHabitDatesToStreakType(habitProgress: {
  [noteKey: string]: HabitDayProgress[];
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
  habitProgress: HabitDayProgress[],
  since: Date,
  interpretUntypedNumberAsMinutes: boolean = false
): {
  totalTimes: number;
} {
  let totalTimes = 0;

  let i = habitProgress.length - 1;
  let date = new Date(habitProgress[habitProgress.length - 1].date);
  while (date.getTime() >= since.getTime()) {
    totalTimes++;
    const progressUnit = habitProgress[i].unit;
    if (
      (progressUnit != null && ["m", "h"].includes(progressUnit)) ||
      (progressUnit == null && interpretUntypedNumberAsMinutes)
    ) {
      // TODO: handle progress for different types of units
    }
    i--;
    date = new Date(habitProgress[i].date);
  }
  return {
    totalTimes,
  };
}

export function getHabitGoalProgress(
  goalInfo: NonNullable<Habit["goalInfo"]>,
  habitProgress: HabitDayProgress[]
): number {
  const days = goalIntervalToDays(goalInfo.interval, goalInfo.intervalTimeUnit);
  let date = new Date(habitProgress[habitProgress.length - 1].date);

  const lookbackDays =
    date.getTime() === new Date().getTime() ? days - 1 : days;
  let startDate = new Date();
  startDate.setDate(startDate.getDate() - lookbackDays);
  startDate.setHours(0);
  startDate.setMinutes(0);
  startDate.setSeconds(0);
  startDate.setMilliseconds(0);

  let progress = 0;
  let i = habitProgress.length - 1;

  while (date.getTime() >= startDate.getTime()) {
    let { value, unit } = habitProgress[i];
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
    i--;
    date = getLocalDate(new Date(habitProgress[i].date));
  }
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
