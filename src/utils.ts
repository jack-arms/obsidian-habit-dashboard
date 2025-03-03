import type { GoalTimeUnit, GoalIntervalTimeUnit } from "./types";

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
