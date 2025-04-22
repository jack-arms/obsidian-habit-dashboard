export type HabitProgressUnit = null | "x" | "m" | "h" | string;
export type GoalIntervalTimeUnit = "d" | "w" | "m";

export type HabitDayProgress = {
  date: string;
  noteHref: string;
  value: number | null;
  unit: HabitProgressUnit | null;
};

export interface Habit {
  name: string;
  noteKey: string;
  createDate: string;
  goalInfo?: {
    goal: number;
    goalUnit: HabitProgressUnit;
    interval: number;
    intervalTimeUnit: GoalIntervalTimeUnit;
    goalCreateDate: string;
  };
}
