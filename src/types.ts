import type { HabitProgressUnit } from "./units";

export type GoalIntervalTimeUnit = "d" | "w" | "m";

export type AggregatedHabitProgress = {
  times: number;
  progress: {
    [unit: string]: number;
  };
  untypedProgress: number;
};

export type HabitDayProgress = {
  date: string;
  noteHref: string;
  value: number | null;
  unit: string | null;
};

export interface Habit {
  name: string;
  noteKey: string;
  createDate: string;
  goalInfo?: {
    goal: number;
    goalUnit: HabitProgressUnit | string | null;
    interval: number;
    intervalTimeUnit: GoalIntervalTimeUnit;
    goalCreateDate: string;
  };
}
