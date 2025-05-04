import {
  type Habit,
  type GoalIntervalTimeUnit,
  type HabitDayProgress,
} from "../types";

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

export function getDateKey(moment: moment.Moment) {
  return moment.format("Y-MM-DD");
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

export function latestHabitProgress(habitProgress: HabitDayProgress[]) {
  return habitProgress.reduce(
    (a, b) => (a.date > b.date ? a : b),
    habitProgress[0]
  );
}
