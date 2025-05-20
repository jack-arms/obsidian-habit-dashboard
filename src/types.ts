export type GoalIntervalTimeUnit = "d" | "w" | "m";

export type AggregatedHabitProgress = {
  times: number;
  minutes: number;
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

export type HabitGoalInfo = {
  goal: number;
  goalUnit: HabitTimeProgressUnit | string | null;
  interval: number;
  intervalTimeUnit: GoalIntervalTimeUnit;
  goalCreateDate: string;
};

export interface Habit {
  name: string;
  noteKey: string;
  createDate: string;
  goalInfo?: HabitGoalInfo;
}

export const HabitTimeProgressUnits = {
  m: {
    toBase: 1,
  },
  h: {
    toBase: 60,
  },
} as const;

export type HabitTimeProgressUnit = keyof typeof HabitTimeProgressUnits;

export type Nullable<T> = { [K in keyof T]: T[K] | null };
