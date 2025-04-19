export type HabitTimeUnit = null | "x" | "m" | "h";
export type GoalIntervalTimeUnit = "d" | "w" | "m";

export type HabitDayProgress = {
  date: string;
  progressMinutes: number | null;
};
