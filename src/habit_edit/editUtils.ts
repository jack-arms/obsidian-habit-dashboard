import type { Habit, HabitGoalInfo, Nullable } from "src/types";

export type FormHabit = Pick<Habit, "name" | "noteKey">;
export type FormHabitGoalInfo = Pick<
  HabitGoalInfo,
  "goal" | "goalUnit" | "interval" | "intervalTimeUnit"
>;

const validate = <T>(value: T, validator: (v: T) => boolean) =>
  validator(value) ? value : undefined;

export function validateForm(
  habit: Nullable<FormHabit>,
  goalInfo: Nullable<FormHabitGoalInfo>,
  goalInfoInputDisabled: boolean,
  isCustomGoalTimeUnit: boolean
) {
  return {
    validatedName: validate(habit.name, (name) => name != null && name !== ""),
    validatedNoteKey: validate(
      habit.noteKey,
      (noteKey) => noteKey != null && noteKey !== ""
    ),
    validatedGoalAmountInput: validate(
      goalInfo.goal,
      (goal) => goalInfoInputDisabled || (goal != null && goal > 0)
    ),
    validatedGoalIntervalInput: validate(
      goalInfo.interval,
      (interval) => goalInfoInputDisabled || (interval != null && interval > 0)
    ),
    validatedGoalUnitInput: validate(
      goalInfo.goalUnit,
      (unit) =>
        goalInfoInputDisabled ||
        !isCustomGoalTimeUnit ||
        (unit != null && unit !== "")
    ),
  };
}
